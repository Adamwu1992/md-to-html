export class State {
    public value: String;
    public out: State;
    public out1: State;
    public lastlist: Number;

    public constructor(value: String, out: State, out1: State, lastlist: Number) {
        this.value = value;
        this.out = out;
        this.out1 = out1;
        this.lastlist = lastlist;
    }
};

export interface Fragment {
    start: State;
    out: Array<State>;
};

export function list1(state: State): Array<State> {
    return [state];
}
export function append(list1: Array<State>, list2: Array<State>): Array<State> {
    return list1.concat(list2);
}
export function patch(list: Array<State>, state: State): void {
    list = list.map(() => state);
}

export function parse2nfa(input) {
    let index: Number;
    let stack: Array<Fragment> = [];
    let s: State;
    let e1: Fragment;
    let e2: Fragment;
    let e: Fragment;
    let currentStack: Fragment;

    const push = (f: Fragment) => {
        stack.push(f);
        currentStack = f;
    };

    const pop = () => {
        const f = stack.pop();
        currentStack = stack[stack.length - 1];
        return f;
    }

    currentStack = stack[0];

    for (let i = 0; input[i]; i++) {
        console.log('compile', input[i]);
        switch(input[i]) {
            case '.':
                e2 = pop();
                e1 = pop();
                patch(e1.out, e2.start);
                push({
                    start: e1.start,
                    out: e2.out
                });
                break;
            case '|':
                e2 = pop();
                e1 = pop();
                s = new State('Split', e1.start, e2.start, 0);
                push({
                    start: s,
                    out: append(e1.out, e2.out)
                });
                break;
            case '?':
                e = pop();
                s = new State('Split', e.start, null, 0);
                push({
                    start: s,
                    out: append(e.out, list1(s.out))
                });
                break;
            case '*':
                e = pop();
                s = new State('Split', e.start, null, 0);
                patch(e.out, s);
                push({
                    start: s,
                    out: list1(s.out1)
                });
                break;
            case '+':
                e = pop();
                s = new State('Split', e.start, null, 0);
                patch(e.out, s);
                push({
                    start: e.start,
                    out: list1(s.out1)
                })
                break;
            default:
                s = new State(input[i], null, null, 0);
                push({
                    start: s,
                    out: list1(s.out)
                });
                break;
        }
        console.log(stack);
        console.log();
    }

    e = pop();
    patch(e.out, new State('matchstate', null, null, 0));
    return e.start;
}


const s = parse2nfa('ab.');
console.log(s);