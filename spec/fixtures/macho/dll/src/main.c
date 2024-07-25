#include <stdio.h>
#include <dlfcn.h>

#include "sample.h"

int main(int argc, char *argv[]) {
	void * sample = dlopen("sample.dylib", RTLD_LAZY);
	if (!sample) {
		return 1;
	}
	sample_message_ptr sample_message = (sample_message_ptr)dlsym(sample, "sample_message");
	if (!sample_message) {
		return 1;
	}
	const char * message = sample_message();
	printf("%s\n", message);
	return 0;
}
