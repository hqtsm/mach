#include <stdio.h>

#include "sample.h"

int main(int argc, char *argv[]) {
	const char * message = sample_message();
	printf("%s\n", message);
	return 0;
}
