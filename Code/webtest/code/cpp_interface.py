import subprocess

class CppInterface:
    def __init__(self, cpp_path):
        self.process = subprocess.Popen(
            cpp_path, 
            stdin=subprocess.PIPE, 
            stdout=subprocess.PIPE, 
            text=True)

    def initialize(self, array, int1, int2, int3):
        integers_str = f'{int1} {int2} {int3}'
        array_str = ' '.join([' '.join(map(str, row)) for row in array])
        input_str = integers_str + ' ' + array_str
        print(input_str)

        self.process.stdin.write(input_str + '\n')
        self.process.stdin.flush()
        
        output_str = self.process.stdout.readline().strip()
        print(output_str)
        pair1, pair2 = map(int, output_str.split()[-2:])
        print("pair1: " + str(pair1) + ", pair2: " + str(pair2))

        #nodes
        output_str = self.process.stdout.readline().strip()
        nodeNum = int(output_str)
        node_vectors = []
        node_upperBound = []
        node_lowerBound = []
        for i in range(nodeNum):
            line = self.process.stdout.readline().strip() 
            string_array = line.split()
            node_vectors.append(string_array)
            #upper
            upperBound = []
            output_str = self.process.stdout.readline().strip()
            upperNum = int(output_str)
            for i in range(upperNum):
                up1 = self.process.stdout.readline().strip().split()
                up = [float(point) for point in up1]
                upperBound.append(up)
            node_upperBound.append(upperBound)
            #lower
            lowerBound = []
            output_str = self.process.stdout.readline().strip()
            lowerNum = int(output_str)
            for i in range(lowerNum):
                lw1 = self.process.stdout.readline().strip().split()
                lw = [float(point) for point in lw1]
                lowerBound.append(lw)
            node_lowerBound.append(lowerBound)
        print(node_vectors)
        print(node_upperBound)
        print(node_lowerBound)

        #relations
        output_str = self.process.stdout.readline().strip()
        relationNum = int(output_str)  
        lines = [self.process.stdout.readline() for _ in range(relationNum)]  
        relation_vectors = []  
        for line in lines:
            stripped_line = line.strip().split()
            string_array = [int(point) for point in stripped_line]
            relation_vectors.append(string_array)
        print(relation_vectors)


        #extremePt
        output_str = self.process.stdout.readline().strip()
        extNum = int(output_str)  
        lines = [self.process.stdout.readline() for _ in range(extNum)]  
        ext_vectors = []  
        for line in lines:
            stripped_line = line.strip().split()
            string_array = [float(point) for point in stripped_line]
            ext_vectors.append(string_array)
        print(ext_vectors)
        
        return pair1, pair2, node_vectors, node_upperBound, node_lowerBound, relation_vectors, ext_vectors

    def send_integer(self, integer):
        self.process.stdin.write(f'{integer}\n')
        self.process.stdin.flush()

        #left points
        leftpointsstring = self.process.stdout.readline().strip().split()
        leftpoints = [int(point) for point in leftpointsstring]
        print("leftpoints: " + str(leftpoints))

        #pair
        output_str = self.process.stdout.readline().strip()
        pair1, pair2 = map(int, output_str.split()[-2:])
        print("pair1: " + str(pair1) + ", pair2: " + str(pair2))

        #nodes
        output_str = self.process.stdout.readline().strip()
        nodeNum = int(output_str)
        node_vectors = []
        node_upperBound = []
        node_lowerBound = []
        for i in range(nodeNum):
            line = self.process.stdout.readline().strip() 
            string_array = line.split()
            node_vectors.append(string_array)
            #upper
            upperBound = []
            output_str = self.process.stdout.readline().strip()
            upperNum = int(output_str)
            for i in range(upperNum):
                up1 = self.process.stdout.readline().strip().split()
                up = [float(point) for point in up1]
                upperBound.append(up)
            node_upperBound.append(upperBound)
            #lower
            lowerBound = []
            output_str = self.process.stdout.readline().strip()
            lowerNum = int(output_str)
            for i in range(lowerNum):
                lw1 = self.process.stdout.readline().strip().split()
                lw = [float(point) for point in lw1]
                lowerBound.append(lw)
            node_lowerBound.append(lowerBound)
        print(node_vectors)
        print(node_upperBound)
        print(node_lowerBound)

        #relations
        output_str = self.process.stdout.readline().strip()
        relationNum = int(output_str)  
        lines = [self.process.stdout.readline() for _ in range(relationNum)]  
        relation_vectors = []  
        for line in lines:
            stripped_line = line.strip().split()
            string_array = [int(point) for point in stripped_line]
            relation_vectors.append(string_array)
        print(relation_vectors)


        #extremePt
        output_str = self.process.stdout.readline().strip()
        extNum = int(output_str)  
        print(extNum)
        lines = [self.process.stdout.readline() for _ in range(extNum)]  
        ext_vectors = []  
        for line in lines:
            stripped_line = line.strip().split()
            string_array = [float(point) for point in stripped_line]
            ext_vectors.append(string_array)
        print(ext_vectors)
        
        return pair1, pair2, node_vectors, node_upperBound, node_lowerBound, relation_vectors, ext_vectors, leftpoints


    def terminate_process(self):
        if self.process:
            self.process.terminate()
            self.process.wait()  
