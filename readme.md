# fish

a cli thing for sorting out personal finance


## install

```
$ npm install -g fish-js
```

## usage

Add a `.fish.yaml` file to your `$HOME` directory (see [`.fish.example.yaml`](https://github.com/justinvdm/fish/blob/master/.fish.example.yaml) for an example).

Then run `fish` on a csv file:

```
$ fish data.csv

┌───────┬────────┬───────┬─────────┐
│ tag   │ credit │ debit │ balance │
├───────┼────────┼───────┼─────────┤
│ a     │      3 │   -23 │     -20 │
├───────┼────────┼───────┼─────────┤
│ b     │     20 │     0 │      20 │
├───────┼────────┼───────┼─────────┤
│ total │     23 │   -23 │       0 │
└───────┴────────┴───────┴─────────┘
```
