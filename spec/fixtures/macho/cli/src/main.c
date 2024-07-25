#include <stdio.h>

const char * sample_message(void) {
	const char * message = "Hello world!";
	return message;
}

int main(int argc, char *argv[]) {
	const char * message = sample_message();
	printf("%s\n", message);
	return 0;
}
