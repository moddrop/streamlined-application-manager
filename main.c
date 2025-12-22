#include <stdio.h>

int main() {
    char trcurver = ')';
    char tlcurver = '(';
    char brcurver = '(';
    char blcurver = ')';

    char windoww[] = "-------------------";
    char windowh = '|';
    char title[] = "Window";
    char paragraph[] = "loremipsum";


    printf("%c%s%c\n", trcurver, windoww, tlcurver);
    printf("%c%s%c\n", windowh, title, windowh);
    printf("%c%s%c\n", windowh, paragraph, windowh );
    printf("%c%s%c\n", brcurver, windoww, blcurver);

    return 0;
}
