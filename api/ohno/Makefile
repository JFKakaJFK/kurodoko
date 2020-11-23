CXX=g++
CXXFLAGS= -D_MP_INTERNAL -DNDEBUG -D_EXTERNAL_RELEASE -D_USE_THREAD_LOCAL  -std=c++11 -fvisibility=hidden -c -mfpmath=sse -msse -msse2 -O3 -D_LINUX_ -fPIC -ggdb3
LIB_Z3=/usr/lib/x86_64-linux-gnu/libz3.so

TARGET=solver

default: all

all: $(TARGET) clean_objs

$(TARGET).o: $(TARGET).cpp
	$(CXX) $(CXXFLAGS) -o $(TARGET).o -L$(LIB_Z3) $(TARGET).cpp
$(TARGET): $(TARGET).o
	$(CXX) -o $(TARGET) $(TARGET).o  $(LIB_Z3) -lpthread 


lib.o: $(TARGET).cpp
	$(CXX) -c -fPIC -std=c++11 -O3 -D_LINUX_  -o lib_$(TARGET).o $(TARGET).cpp
lib: lib.o
	$(CXX) -shared -std=c++11 -O3 -D_LINUX_ -Wl,-soname,lib_$(TARGET).so -o lib_$(TARGET).so -L$(LIB_Z3) lib_$(TARGET).o 


clean:
	rm -f $(TARGET).o $(TARGET)

clean_objs:
	rm -f *.o 

clean_all:
	rm -r *.o solver lib_$(TARGET).so

.PHONY: clean clean_objs all clean_all
