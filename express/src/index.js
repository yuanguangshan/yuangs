import { Router } from 'itty-router';
import { corsHeaders } from './cors.js';

// Create a new router
const router = Router();

// Simple in-memory storage (for demo purposes, not persistent)
let users = [];
let nextId = 1;

// Define routes
router
  .get('/users', async (request, env, ctx) => {
    return new Response(
      JSON.stringify({ 
        msg: '获取成功', 
        data: users 
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  })
  
  .post('/users', async (request, env, ctx) => {
    try {
      const body = await request.json();
      const newUser = {
        id: nextId++,
        name: body.name
      };
      users.push(newUser);
      
      return new Response(
        JSON.stringify({ 
          msg: '创建成功', 
          data: newUser 
        }),
        {
          status: 201,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }
  })
  
  .put('/users/:id', async (request, env, ctx) => {
    try {
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/');
      const id = parseInt(pathParts[pathParts.length - 1]);
      
      const index = users.findIndex(user => user.id === id);
      if (index === -1) {
        return new Response(
          JSON.stringify({ error: '用户不存在' }),
          {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          }
        );
      }
      
      const body = await request.json();
      users[index] = { ...users[index], ...body };
      
      return new Response(
        JSON.stringify({ 
          msg: '修改成功', 
          data: users[index] 
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }
  })
  
  .delete('/users/:id', async (request, env, ctx) => {
    try {
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/');
      const id = parseInt(pathParts[pathParts.length - 1]);
      
      const index = users.findIndex(user => user.id === id);
      if (index === -1) {
        return new Response(
          JSON.stringify({ error: '删除失败' }),
          {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          }
        );
      }
      
      users.splice(index, 1);
      
      return new Response(
        JSON.stringify({ msg: '删除成功' }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }
  });

// Handle OPTIONS requests for CORS
router.options('*', () => {
  return new Response(null, {
    headers: corsHeaders
  });
});

// 404 for everything else
router.all('*', () => new Response('Not Found', { status: 404 }));

// Export the handler
export default {
  async fetch(request, env, ctx) {
    // Allow only POST, GET, PUT, DELETE, OPTIONS methods
    if (!['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'].includes(request.method)) {
      return new Response('Method Not Allowed', { status: 405 });
    }

    // Handle the request with the router
    return router.handle(request, env, ctx);
  }
};