import fetch from 'node-fetch';

export default async(context, req) => {
  try{
    context.log('log: fetching jsonplaceholder')
    let r = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    let response = await r.json()
    context.res.json(response)
  } catch (e) {
    context.log(e)
    context.res.status(500).send(e)
  }
  //context.done = () => {}
}