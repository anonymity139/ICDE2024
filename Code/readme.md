# MixedSearch

## This project aims at searching for the user's favorite tuple among the database that is described by numerical and categorical attributes. 


## There are three parts of the code
1. Directory webtest: It handles back-end server. 
2. Directory c++: It handles the algorithms run in the back-end.
3. Directory web: It handles the front-end web.


## Run the project
## Directory c++
1. install apt-get

    ```sh
    # in any directory
    sudo apt-get update
    ```

2. install glpk
    
    ```sh
    # in any directory
    sudo apt-get install glpk-utils
    sudo apt-get install libglpk-dev

    # you can check if it is successfully installed 
    glpsol --version
    ````

3. Update the CMakeList.txt based on the installed glpk

    ```sh
    #check the path that the glpk is installed
    dpkg -L glpk-utils

    #in c++/CMakeList
    #update the path where the glpk is installed 
    set(INC_DIR /usr/local/Cellar/glpk/5.0/include)
    set(LINK_DIR /usr/local/Cellar/glpk/5.0/lib)
    ```

4. Compile the c++ project

    ```sh
    #in c++/
    mkdir build
    cd build
    cmake ..
    make
    ```

5. Move file run to webtest/code/cppprogram

    ```sh
    #in c++/build
    cp run ../../webtest/code/cppprogram
    ```

## Directory web
6. Update the path of socket in file GEGraph.js

    ```sh
    #in file web/react-app/src/componects/GEGraph.js
    #change the URL, e.g., localhost:5000
    this.socket = io.connect('http://39.108.168.228:5000');
    ```

7. Install Yarn.
   [Installation Guide of Yarn](https://yarnpkg.com/lang/en/docs/install/)
   brew install yarn

8. Install dependencies

   ```sh
   # in react-app/
   yarn install
   yarn add d3
   ```
9. pack the web project

   ```sh
   # in react-app/
   yarn build
   ```

10. Move folder build in folder webtest


## webtest
11. Install Flask

    ```sh
    #in any directory
    sudo apt update
    sudo apt install python3-pip
    pip install Flask

    #you can check if Flask is successfully installed
    flask --version
    ```

12. Intaill flask-socketio
    
    ```sh
    #in any directory
    pip install flask-socketio
    ```

13. run the server

    ```sh
    python3 server.py
    ```