$(document).ready(function() 
{
    const body = $('body');
    
    // Here, For Login page
    function showLogin() 
    {
      body.empty();
      body.append
      (`
        <div>
          <h2>Login</h2>
          <input type="text" id="username" placeholder="Username">
          <input type="password" id="password" placeholder="Password">
          <button id="login">Login</button>
          <button id="showRegister">Register</button>
        </div>
      `);
    }
    

    // Here, For Registeration Page
    function showRegister() {
      body.empty();
      body.append(`
        <div>
          <h2>Register</h2>
          <input type="text" id="username" placeholder="Username">
          <input type="password" id="password" placeholder="Password">
          <button id="register">Register</button>
          <button id="showLogin">Login</button>
        </div>
      `);
    }
    
    // This is for notes page 
    function showNotes() {
      body.empty();
      body.append(`
        <div>
          <h2>Notes</h2>
          <textarea id="noteContent" placeholder="Write your notes...."></textarea>
          <button id="createNote">Create Note</button>
          <button id="logout">Logout</button>
          <div id="notes"></div>
        </div>
      `);
      loadNotes();
    }
    
    function loadNotes() 
    {
      const token = localStorage.getItem('token');
      $.ajax({
        url: '/api/notes',
        method: 'GET',
        headers: { token: token },
        success: function(notes) {
          const notesDiv = $('#notes');
          notesDiv.empty();
          notes.forEach(note => {
            notesDiv.append(`<p>${note.content}</p>`);
          });
        }
      });
    }
    
    $(document).on('click', '#login', function() 
    {
      const username = $('#username').val();
      const password = $('#password').val();
      
      $.ajax({
        url: '/api/login',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ username, password }),
        success: function(data) {
          localStorage.setItem('token', data.token);
          showNotes();
        },
        error: function(err) {
          alert('Login failed');
        }
      });
    });
    
    $(document).on('click', '#register', function() {
      const username = $('#username').val();
      const password = $('#password').val();
      
      $.ajax({
        url: '/api/register',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ username, password }),
        success: function(data) 
        {
          alert('Registration successful');
          showLogin();
        },
        error: function(err) 
        {
          alert('Registration failed');
        }
      });
    });
    
    $(document).on('click', '#createNote', function() 
    {
      const token = localStorage.getItem('token');
      const note = $('#noteContent').val();
      
      $.ajax({
        url: '/api/notes',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ token, note }),
        success: function(data) {
          $('#noteContent').val('');
          loadNotes();
        },
        error: function(err) {
          alert('Failed to create note');
        }
      });
    });
    
    $(document).on('click', '#logout', function() 
    {
      localStorage.removeItem('token');
      showLogin();
    });
    
    $(document).on('click', '#showRegister', function() 
    {
      showRegister();
    });
    
    $(document).on('click', '#showLogin', function() 
    {
      showLogin();
    });
    
    showLogin();
  
});
  