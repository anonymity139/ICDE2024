#ifndef RUN_ALGORITHMRUNNER_H
#define RUN_ALGORITHMRUNNER_H


#include "structure/cluster_t.h"
#include "structure/rnode_tree.h"
#include "structure/r_node.h"
#include "structure/relational_graph.h"

class AlgorithmRunner
{
public:
    int d_num, x = 0;
    cluster_t *c;
    hyperplane_set *R;
    double t_count = 10;
    rnode_tree *tree;
    relational_graph *RG;
    tuple_t *tp1, *tp2;
    int cid_1, cid_2, tid_1, tid_2;

    //constructor
    AlgorithmRunner(tuple_set *t_set);
    AlgorithmRunner(vector<vector<string> > &string_set, int d_cat, int d_num);
    vector<int> nextPair();
    vector<int> feedback(int option);

};








#endif //RUN_ALGORITHMRUNNER_H
