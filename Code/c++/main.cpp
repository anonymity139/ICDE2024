#include "structure/point_set.h"
#include "structure/tuple_set.h"
#include "structure/define.h"
#include <vector>
#include "AlgorithmRunner.h"
#include <vector>
#include <algorithm>

bool containsSameElements(const std::vector<int>& a, const std::vector<int>& b) {
    if (a.size() != b.size()) return false;

    std::vector<int> a_sorted(a);
    std::vector<int> b_sorted(b);

    std::sort(a_sorted.begin(), a_sorted.end());
    std::sort(b_sorted.begin(), b_sorted.end());

    return a_sorted == b_sorted;
}

std::vector<std::vector<int>> removeDuplicateArrays(std::vector<std::vector<int>>& matrix) {
    std::vector<std::vector<int>> result;

    for (const auto& arr : matrix) {
        bool isDuplicate = false;

        for (const auto& uniqueArr : result) {
            if (containsSameElements(arr, uniqueArr)) {
                isDuplicate = true;
                break;
            }
        }

        if (!isDuplicate) {
            result.push_back(arr);
        }
    }

    return result;
}

int main(int argc, char *argv[])
{

    int num, d_cat, d_num;
    std::cin >> num >> d_cat >> d_num;

    vector<vector<string>> candidates;
    for(int i = 0; i < num; ++i)
    {
        vector<string> temp;
        for(int j = 0; j < d_cat + d_num; ++j)
        {
            std::string s;
            std::cin >> s;
            temp.push_back(s);
        }
        candidates.push_back(temp);
    }

    //p_skyline->print(); t_skyline->print();
    AlgorithmRunner *GE = new AlgorithmRunner(candidates, d_cat, d_num);
    //AlgorithmRunner *GE = new AlgorithmRunner(t_skyline);
    while(GE->t_count > 1)
    {
        vector<int> pair = GE->nextPair();
        std::cout << pair[0] << " " << pair[1] << std::endl; //two tuples for selection
        //node
        std::cout << GE->RG->list.size() << std::endl;
        for(int i = 0; i < GE->RG->list.size(); ++i)
        {
            for(int j = 0; j < GE->RG->list[i]->len; j++)
            {
                std::cout << GE->RG->list[i]->s_1[j] <<" ";
            }
            for(int j = 0; j < GE->RG->list[i]->len; j++)
            {
                std::cout << GE->RG->list[i]->s_2[j] <<" ";
            }
            std::cout << std::endl;

            //upper bound
            std::cout << GE->RG->list[i]->ineqleq.size() << std::endl;
            for(int j = 0; j < GE->RG->list[i]->ineqleq.size(); j++)
            {
                for(int dd = 0; dd < d_num; ++dd)
                {
                    std::cout << GE->RG->list[i]->ineqleq[j].norm[dd] << " ";
                }
                std::cout << std::endl;
            }
            //lower bound
            std::cout << GE->RG->list[i]->ineqgeq.size() << std::endl;
            for(int j = 0; j < GE->RG->list[i]->ineqgeq.size(); j++)
            {
                for(int dd = 0; dd < d_num; ++dd)
                {
                    std::cout << GE->RG->list[i]->ineqgeq[j].norm[dd] << " ";
                }
                std::cout << std::endl;
            }


        }

        //relational node
        std::vector<std::vector<int>> relations;
        for(int i = 0; i < GE->RG->rlist.size(); ++i)
        {
            relations.push_back({GE->RG->rlist[i]->node_1->ID, GE->RG->rlist[i]->node_2->ID});
            relations.push_back({GE->RG->rlist[i]->node_1->ID, GE->RG->rlist[i]->node_sum->ID});
            relations.push_back({GE->RG->rlist[i]->node_2->ID, GE->RG->rlist[i]->node_sum->ID});
        }
        relations = removeDuplicateArrays(relations);
        std::cout << relations.size() << std::endl;
        for(int i = 0; i < relations.size(); ++i)
        {
            std::cout << relations[i][0] << " " << relations[i][1] << std::endl;
        }

        //numerical range
        std::cout << GE->R->ext_pts.size() << std::endl;
        for(int i = 0; i < GE->R->ext_pts.size(); ++i)
        {
            for(int j = 0; j < GE->R->ext_pts[i]->d; ++j)
            {
                std::cout << GE->R->ext_pts[i]->attr[j] << " ";
            }
            std::cout << std::endl;
        }

        vector<int> tupleIndex;
        int option;
        std::cin >> option;
        if (option == 1)
           tupleIndex = GE->feedback(1);
        else
           tupleIndex = GE->feedback(2);
        //rest of tuples
        for(int i = 0; i < tupleIndex.size(); ++i)
        {
            std::cout << tupleIndex[i] << " ";
        }
        std::cout << std::endl;
    }


    std::cout <<  GE->c->clusters[0]->tuples[0]->id << " " <<  GE->c->clusters[0]->tuples[0]->id << std::endl; //two tuples for selection
    //node
    std::cout << GE->RG->list.size() << std::endl;
    for(int i = 0; i < GE->RG->list.size(); ++i)
    {
        std::cout << GE->RG->list[i]->ID << " ";
        for(int j = 0; j < GE->RG->list[i]->len; j++)
        {
            std::cout << GE->RG->list[i]->s_1[j] <<" ";
        }
        for(int j = 0; j < GE->RG->list[i]->len; j++)
        {
            std::cout << GE->RG->list[i]->s_2[j] <<" ";
        }
        std::cout << std::endl;

        //upper bound
        std::cout << GE->RG->list[i]->ineqleq.size() << std::endl;
        for(int j = 0; j < GE->RG->list[i]->ineqleq.size(); j++)
        {
            for(int dd = 0; dd < d_num; ++dd)
            {
                std::cout << GE->RG->list[i]->ineqleq[j].norm[dd] << " ";
            }
            std::cout << std::endl;
        }
        //lower bound
        std::cout << GE->RG->list[i]->ineqgeq.size() << std::endl;
        for(int j = 0; j < GE->RG->list[i]->ineqgeq.size(); j++)
        {
            for(int dd = 0; dd < d_num; ++dd)
            {
                std::cout << GE->RG->list[i]->ineqgeq[j].norm[dd] << " ";
            }
            std::cout << std::endl;
        }


    }


    //relational node
    std::vector<std::vector<int>> relations;
    for(int i = 0; i < GE->RG->rlist.size(); ++i)
    {
        relations.push_back({GE->RG->rlist[i]->node_1->ID, GE->RG->rlist[i]->node_2->ID, GE->RG->rlist[i]->node_sum->ID});
    }
    relations = removeDuplicateArrays(relations);
    std::cout << relations.size() << std::endl;
    for(int i = 0; i < relations.size(); ++i)
    {
        std::cout << relations[i][0] << " " << relations[i][1] << " " << relations[i][2] << std::endl;
    }


    //numerical range
    std::cout << GE->R->ext_pts.size() << std::endl;
    for(int i = 0; i < GE->R->ext_pts.size(); ++i)
    {
        for(int j = 0; j < GE->R->ext_pts[i]->d; ++j)
        {
            std::cout << GE->R->ext_pts[i]->attr[j] << " ";
        }
        std::cout << std::endl;
    }


    return 0;
}
