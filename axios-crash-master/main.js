// We are making request on jsonplaceholder.typicode

// AXIOS GLOBALS
axios.defaults.headers.common['X-Auth-Token'] = 'sometoken';
// We can see this token in the config when we make any request
 
// GET REQUEST
function getTodos() {
  // axios is written with an object with two parameters 
  // it returns a promise
  // axios({
  //   method: 'get',
  //   url: 'https://jsonplaceholder.typicode.com/posts',
  //   params:{
  //     // will limit the number of return objects to just 5
  //     _limit: 5
  //   }
  // }).then(res=> showOutput(res))
  //   .catch(err=>console.error(err));

  // We can also put timeout  (if the request takes more than 5 sec, the request is going to timeout)
    axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5',{timeout: 5000})
      .then(res=> showOutput(res))
      .catch(err=>console.error(err));

}

// POST REQUEST
function addTodo() {
  // axios({
  //   method: 'post',
  //   url: 'https://jsonplaceholder.typicode.com/posts',
  //   // We are adding data which we will see on the screen after successful completion
  //   data:{
  //     title: 'New Todo',
  //     completed: false
  //   }
  // }).then(res=> showOutput(res))
  //   .catch(err=>console.error(err));

    axios.post( 'https://jsonplaceholder.typicode.com/todos',{
      // We are adding data which we will see on the screen after successful completion
        title: 'New Todo',
        completed: false
      })
      .then(res=> showOutput(res))
      .catch(err=>console.error(err));
}

// PUT/PATCH REQUEST
function updateTodo() {
  // We are putting the id in the url  for which we are updating the data
  // Put replaces the entire data whereas patch will replace only the specified data
  // axios.put( 'https://jsonplaceholder.typicode.com/posts/1',{
  //     // We are adding data which we will see on the screen after successful completion
  //       title: 'Updated Todo',
  //       completed: true
  //     })
  //     .then(res=> showOutput(res))
  //     .catch(err=>console.error(err));

  axios.patch( 'https://jsonplaceholder.typicode.com/todos/1',{
      // We are adding data which we will see on the screen after successful completion
        title: 'Updated Todo',
        completed: true
      })
      .then(res=> showOutput(res))
      .catch(err=>console.error(err));
}

// DELETE REQUEST
function removeTodo() {
  axios.delete( 'https://jsonplaceholder.typicode.com/todos/1')
      .then(res=> showOutput(res))
      .catch(err=>console.error(err));
}

// SIMULTANEOUS DATA
function getData() {
  // To make simultaneous requests
  axios.all([
    axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5'),
    axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5')
  ])
  .then(axios.spread((todos,posts)=> showOutput(posts)))
  .catch(err=>console.error(err));
}

// CUSTOM HEADERS
// Sending data to the headers may be used while authentication
function customHeaders() {
  const config = {
    headers: {
      'Content-Type' : 'application/json',
      Authorization: 'sometoken'
    }
  }

  axios.post( 'https://jsonplaceholder.typicode.com/todos',{
      // We are adding data which we will see on the screen after successful completion
        title: 'New Todo',
        completed: false
      },
      config)
      .then(res=> showOutput(res))
      .catch(err=>console.error(err));
}

// TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {
  const options={
    method: 'post',
    url: 'https://jsonplaceholder.typicode.com/todos',
    data:{
      title:'Hello World'
    },
    // We ae transforming the data in the request 
    transformResponse: axios.defaults.transformResponse.concat(data => {
      data.title=data.title.toUpperCase();
      return data;
    })
  }
  axios(options).then(res=>showOutput(res))
}

// ERROR HANDLING
function errorHandling() {
  // We have changed the link so as to recieve an error
  axios.get('https://jsonplaceholder.typicode.com/todo?_limit=5')
      .then(res=> showOutput(res))
      .catch(err=>{
        if(err.response){
          // If the server responded with a status other than 200 range
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
          
          if(err.response.status === 404){
            alert('Error: Page Not Found');
          }
        } else if(err.request){
          //the request was made but there was no response
          console.log(err.request);
        } else{
          console.log(err.message);
        }
      });
}

// CANCEL TOKEN
function cancelToken() {
  // We can cancel requests too
  const source=axios.CancelToken.source();
  axios
    .get('https://jsonplaceholder.typicode.com/todos?_limit=5',{
      cancelToken: source.token
    })
    .then(res=> showOutput(res))
    .catch(thrown=>{
      if(axios.isCancel(thrown)){
        console.log('Request cancelled', thrown.message);
      }
    })

    if(true){
      source.cancel('Request cancelled!');
    }
}

// INTERCEPTING REQUESTS & RESPONSES
// Interceptors are used to intercept the request and run some kinf of functionality like a logger
// Will give info about all type of requests that user might make
// config givves access to method, url etc.
axios.interceptors.request.use(config=>{
  console.log(`${config.method.toUpperCase()} request send to ${config.url} at ${new Date().getTime()}`);

  return config;
},error=>{
  return Promise.reject(error);
});

// AXIOS INSTANCES

const axiosInstance=axios.create({
  // Other custom settings
  baseURL: 'https://jsonplaceholder.typicode.com'
});

axiosInstance.get('/comments').then(res=>showOutput(res))

// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
  .getElementById('transform')
  .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);
