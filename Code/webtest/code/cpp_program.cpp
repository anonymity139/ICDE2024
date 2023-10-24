#include <iostream>
#include <vector>

int main() {
    std::vector<std::vector<std::string> > matrix;
    int int1, int2;
    
    // Read initialization data from standard input
    for (int i = 0; i < 2; ++i) 
    {
        std::vector<std::string> row;
        for (int j = 0; j < 2; ++j) 
        {
            std::string s;
            std::cin >> s;
            row.push_back(s);
        }
        matrix.push_back(row);
    }
    std::cin >> int1 >> int2;

    // Respond with initial data after reading initialization input
    std::cout << "1 2 3 4 " << int1 << " " << int2 << std::endl;

    // Continuous loop to interact with the Python server
    while (true) 
    {
        int received_integer;
        std::cin >> received_integer;

        // Here, you should put your actual logic for processing the received integer
        std::cout << "5 6 7 8 " << received_integer << " " << (received_integer + 1) << std::endl;
    }

    return 0;
}
