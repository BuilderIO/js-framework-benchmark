import { $, component$, QRL, Signal, useSignal, useStore } from '@builder.io/qwik';

let idCounter = 1;
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"],
  colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"],
  nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function _random (max: number) { return Math.round(Math.random() * 1000) % max; }

export function buildData(count: number) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: idCounter++,
      label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`
    }
  }
  return data;
}

interface DataItem {
  id: number;
  label: string;
}
export const App = component$(() => {
  const state = useStore<DataItem[]>({data: []}, {deep: true});
  const selected = useSignal<number | null>(null);

  const remove = $((id: number) => {
    const d = state.data;
    d.splice(
      d.findIndex((d) => d.id === id),
      1
    )
  });
  return (
    <div class='container'>
      <div class='jumbotron'>
        <div class='row'>
          <div class='col-md-6'><h1>Qwik Keyed</h1></div>
          <div class='col-md-6'>
            <div class='row'>
              <div class='col-sm-6 smallpad'>
                <button
                  id='run' class='btn btn-primary btn-block' type='button'
                  onClick$={() => state.data = buildData(1000)}
                >
                  Create 1,000 rows
                </button>
              </div>
              <div class='col-sm-6 smallpad'>
                <button
                  id='runlots' class='btn btn-primary btn-block' type='button'
                  onClick$={() => state.data = buildData(10000)}
                >
                  Create 10,000 rows
                </button>
              </div>
              <div class='col-sm-6 smallpad'>
                <button
                  id='add' class='btn btn-primary btn-block' type='button'
                  onClick$={() => state.data.concat(buildData(1000))}
                >
                  Append 1,000 rows
                </button>
              </div>
              <div class='col-sm-6 smallpad'>
                <button
                  id='update' class='btn btn-primary btn-block' type='button'
                  onClick$={() => {
                    // data.value = data.value.slice();
                    for(let i = 0, d = state.data, len = d.length; i < len; i += 10) {
                      d[i].label = d[i].label + ' !!!';
                    }
                  }}
                >
                  Update every 10th row
                </button>
              </div>
              <div class='col-sm-6 smallpad'>
                <button
                  id='clear' class='btn btn-primary btn-block' type='button'
                  onClick$={() => state.data = []}
                >
                  Clear
                </button>
              </div>
              <div class='col-sm-6 smallpad'>
                <button
                  id='swaprows' class='btn btn-primary btn-block' type='button'
                  onClick$={() => {
                    const d = state.data;
                    if (d.length > 998) {
                      const tmp = d[1];
                      d[1] = d[998];
                      d[998] = tmp;
                    }
                  }}
                >
                  Swap Rows
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
      <table class='table table-hover table-striped test-data'>
        <tbody>
          {/* { data.value.map((data) => (
              <tr
                key={data.id}
                class={{
                  'danger': data.id === selected.value
                }}
              >
                <td class='col-md-1'>{data.id}</td>
                <td class='col-md-4'><a
                onClick$={
                  () => selected.value = data.id
                }
                >{data.label}</a></td>
                <td class='col-md-1'>
                  <a onClick$={() => remove(data.id)}>
                    <span class='glyphicon glyphicon-remove' aria-hidden="true" />
                  </a>
                </td>
                <td class='col-md-6'/>
              </tr>
          ))} */}
          { state.data.map((data) => (
            <Row key={data.id} data={data} selected={selected} remove={remove} />
          ))}
        </tbody>
      </table>
      <span class='preloadicon glyphicon glyphicon-remove' aria-hidden="true" />
    </div>
  );
});

interface RowProps {
  data: DataItem;
  selected: Signal<number | null>;
  remove: QRL<(id: number) => void>;
}

export const Row = component$<RowProps>((props) => {
  return (
    <tr class={{
      'danger': props.data.id === props.selected.value
    }}>
      <td class='col-md-1'>{props.data.id}</td>
      <td class='col-md-4'><a
      onClick$={
        () => props.selected.value = props.data.id
      }
      >{props.data.label}</a></td>
      <td class='col-md-1'>
        <a onClick$={() => props.remove(props.data.id)}>
          <span class='glyphicon glyphicon-remove' aria-hidden="true" />
        </a>
      </td>
      <td class='col-md-6'/>
    </tr>
  )
});
