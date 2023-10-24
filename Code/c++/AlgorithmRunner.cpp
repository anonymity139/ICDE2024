#include "AlgorithmRunner.h"


AlgorithmRunner::AlgorithmRunner(vector<vector<string>> &string_set, int d_cat, int d_num)
{

    tuple_set *t_set = new tuple_set();
    for(int i = 0; i < string_set.size(); i++)
    {
        tuple_t *t =new tuple_t(d_cat, d_num, i);

        for (int j = 0; j < d_cat; j++)//categorical attributes
        {
            t->attr_cat[j] = string_set[i][j];
        }
        for (int j = 0; j < d_num; j++)//numerical attributes
        {
            t->attr_num[j] = atof(string_set[i][j + d_cat].c_str());
        }
        t_set->tuples.push_back(t);
    }

    this->d_num = d_num; x = 0;
    c = new cluster_t(t_set);
    R = new hyperplane_set(d_num, 1);
    t_count = 10;
    tree = new rnode_tree();
    RG = new relational_graph(c, tree);
    RG->set_relation_fast(tree);

}


AlgorithmRunner::AlgorithmRunner(tuple_set *t_set)
{

    this->d_num = t_set->tuples[0]->d_num; x = 0;
    c = new cluster_t(t_set);
    R = new hyperplane_set(d_num, 1);
    t_count = 10;
    tree = new rnode_tree();
    RG = new relational_graph(c, tree);
}



vector<int> AlgorithmRunner::nextPair()
{
    double u_range = 1, ROUND = 2, selectRatio = 2;
    //randomly select two tuples
    int tsize = c->count_cluster();
    if (tsize >= c->clusters.size())
        c->select_tuple(tp1, tp2, cid_1, cid_2, tid_1, tid_2);
    else
    {
        tuple_t *tpnum1, *tpnum2;
        int cidnum_1, cidnum_2, tidnum_1, tidnum_2;
        tuple_t *tpcat1, *tpcat2;
        int cidcat_1, cidcat_2, tidcat_1, tidcat_2;
        c->select_tuple_sameset(tpnum1, tpnum2, cidnum_1, cidnum_2, tidnum_1, tidnum_2);
        c->select_tuple(tpcat1, tpcat2, cidcat_1, cidcat_2, tidcat_1, tidcat_2);
        std::string *s1 = tpcat1->attr_cat;
        std::string *s2 = tpcat2->attr_cat;
        int d_num = tpnum1->d_num;

        //find the node needed to update
        int direction;
        double numericalPrune = 0, categoricalPrune = 0, numOriginal = 0;
        int RGindex = RG->find_node(s1, s2, direction);
        r_node *nd;
        if (RGindex != -1)
            nd = RG->list[RGindex];
        else
            nd = RG->list[0];
        for (int i = 0; i < nd->sets.size(); ++i)
        {
            numOriginal += nd->sets[i].first->tuples.size();
            numOriginal += nd->sets[i].second->tuples.size();
        }

        //numerical approximate
        r_node *newnd = new r_node(nd);
        hyperplane_set *R1 = new hyperplane_set(R);
        R1->hyperplanes.push_back(new hyperplane(tpnum2, tpnum1, 0));
        R1->set_ext_pts(u_range);
        for (int i = 0; i < newnd->sets.size(); ++i)
        {
            numericalPrune += R1->num_prune_same_cat(newnd->sets[i].first);
            numericalPrune += R1->num_prune_same_cat(newnd->sets[i].second);
        }

        newnd = new r_node(nd);
        hyperplane_set *R2 = new hyperplane_set(R);
        R2->hyperplanes.push_back(new hyperplane(tpnum1, tpnum2, 0));
        R2->set_ext_pts(u_range);
        for (int i = 0; i < newnd->sets.size(); ++i)
        {
            numericalPrune += R2->num_prune_same_cat(newnd->sets[i].first);
            numericalPrune += R2->num_prune_same_cat(newnd->sets[i].second);
        }
        numericalPrune /= 2;


        //categorical approximate
        newnd = new r_node(nd);
        double *v = new double[d_num];
        if (direction == -1)
        {
            for (int i = 0; i < d_num; ++i)
                v[i] = tpcat2->attr_num[i] - tpcat1->attr_num[i];
        } else if (direction == 1)
        {
            for (int i = 0; i < d_num; ++i)
                v[i] = tpcat1->attr_num[i] - tpcat2->attr_num[i];
        }
        std::vector<double> coeff;
        for (int i = 0; i < x; ++i)
            coeff.push_back(0);
        coeff.push_back(1);
        hyperplane_set *R3 = new hyperplane_set(R);
        newnd->update_without_check_round(v, direction, R3, coeff, u_range);
        newnd->tuple_prune_all_rnode_aggre(R);
        for (int i = 0; i < newnd->sets.size(); ++i)
        {
            categoricalPrune += newnd->sets[i].first->tuples.size();
            categoricalPrune += newnd->sets[i].second->tuples.size();
        }

        newnd = new r_node(nd);
        if (direction == -1)
            direction = 1;
        else
            direction = -1;
        if (direction == -1)
        {
            for (int i = 0; i < d_num; ++i)
                v[i] = tpcat2->attr_num[i] - tpcat1->attr_num[i];
        } else if (direction == 1)
        {
            for (int i = 0; i < d_num; ++i)
                v[i] = tpcat1->attr_num[i] - tpcat2->attr_num[i];
        }
        std::vector<double> coeff1;
        for (int i = 0; i < x; ++i)
            coeff1.push_back(0);
        coeff1.push_back(1);
        hyperplane_set *R4 = new hyperplane_set(R);
        newnd->update_without_check_round(v, direction, R4, coeff1, u_range);
        newnd->tuple_prune_all_rnode_aggre(R);
        for (int i = 0; i < newnd->sets.size(); ++i)
        {
            categoricalPrune += newnd->sets[i].first->tuples.size();
            categoricalPrune += newnd->sets[i].second->tuples.size();
        }
        categoricalPrune /= 2;
        categoricalPrune = numOriginal - categoricalPrune;


        //cout << categoricalPrune << "    " << numericalPrune << "\n";
        if (categoricalPrune / numericalPrune > selectRatio)
        {
            tp1 = tpcat1;
            tp2 = tpcat2;
            cid_1 = cidcat_1;
            cid_2 = cidcat_2;
            tid_1 = tidcat_1, tid_2 = tidcat_2;
        } else
        {
            tp1 = tpnum1;
            tp2 = tpnum2;
            cid_1 = cidnum_1;
            cid_2 = cidnum_2;
            tid_1 = tidnum_1, tid_2 = tidnum_2;
        }

    }

    vector<int> tupleIndex;
    tupleIndex.push_back(tp1->id);
    tupleIndex.push_back(tp2->id);
    return tupleIndex;
}

vector<int> AlgorithmRunner::feedback(int option)
{
    double u_range = 1, ROUND = 2, selectRatio = 2;
    //update information
    if (!tp1->is_same_cat(tp2))
    {
        if (option == 1)//update the relational graph
        {
            RG->update_all_round(tp2, tp1, R, u_range, x++, tree, ROUND);
            c->clusters[cid_2]->tuples.erase(c->clusters[cid_2]->tuples.begin() + tid_2);
        } else
        {
            RG->update_all_round(tp1, tp2, R, u_range, x++, tree, ROUND);
            c->clusters[cid_1]->tuples.erase(c->clusters[cid_1]->tuples.begin() + tid_1);
        }
        //RG->print_list();
    }
    else
    {
        if (option == 1)
        {
            R->hyperplanes.push_back(new hyperplane(tp2, tp1, 0));
            c->clusters[cid_2]->tuples.erase(c->clusters[cid_2]->tuples.begin() + tid_2);
        } else
        {
            R->hyperplanes.push_back(new hyperplane(tp1, tp2, 0));
            c->clusters[cid_1]->tuples.erase(c->clusters[cid_1]->tuples.begin() + tid_1);
        }
        R->set_ext_pts(u_range);
        ///R->print();
    }
    if (d_num > 1)
        RG->update_basedR(R);

    //prune tuples
    c->prune(R);
    for (int i = 0; i < RG->list.size(); ++i)
    {
        //RG->list[i]->tuple_prune_all_rnode(R);
        RG->list[i]->tuple_prune_all_rnode_aggre(R);
        RG->list[i]->clean();
    }
    t_count = c->count_tuple();

    return c->tuple_index();
}