/**
 * EventEase Supabase Database Services
 * 
 * This file provides functions for performing database operations using Supabase.
 */

import supabase from './supabase';

/**
 * User related database operations
 */
export const userService = {
  // Get a user by ID
  async getUserById(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Get a user by email
  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    return data;
  },
  
  // Create a new user (for use with custom registration, not auth)
  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Update a user
  async updateUser(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Delete a user
  async deleteUser(userId) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    
    if (error) throw error;
    return true;
  }
};

/**
 * Project related database operations
 */
export const projectService = {
  // Get all projects for a user
  async getUserProjects(userId) {
    const { data, error } = await supabase
      .from('project_members')
      .select(`
        project_id,
        role,
        projects (
          id,
          name,
          description,
          created_at,
          start_date,
          due_date,
          status,
          cover_image_url
        )
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data.map(item => ({
      ...item.projects,
      userRole: item.role
    }));
  },
  
  // Get a project by ID
  async getProjectById(projectId) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_members (
          user_id,
          role,
          users (
            id,
            username,
            email,
            full_name,
            avatar_url
          )
        )
      `)
      .eq('id', projectId)
      .single();
    
    if (error) throw error;
    return {
      ...data,
      members: data.project_members.map(member => ({
        id: member.user_id,
        role: member.role,
        ...member.users
      }))
    };
  },
  
  // Create a new project
  async createProject(projectData, creatorId) {
    // Start a transaction
    // First create the project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert([{
        ...projectData,
        created_by: creatorId
      }])
      .select()
      .single();
    
    if (projectError) throw projectError;
    
    // Then add the creator as the owner
    const { error: memberError } = await supabase
      .from('project_members')
      .insert([{
        project_id: project.id,
        user_id: creatorId,
        role: 'owner'
      }]);
    
    if (memberError) throw memberError;
    
    return project;
  },
  
  // Update a project
  async updateProject(projectId, updates) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Delete a project
  async deleteProject(projectId) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    
    if (error) throw error;
    return true;
  },
  
  // Add a member to a project
  async addProjectMember(projectId, userId, role = 'member') {
    const { data, error } = await supabase
      .from('project_members')
      .insert([{
        project_id: projectId,
        user_id: userId,
        role
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Update a member's role in a project
  async updateMemberRole(projectId, userId, role) {
    const { data, error } = await supabase
      .from('project_members')
      .update({ role })
      .match({ project_id: projectId, user_id: userId })
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Remove a member from a project
  async removeProjectMember(projectId, userId) {
    const { error } = await supabase
      .from('project_members')
      .delete()
      .match({ project_id: projectId, user_id: userId });
    
    if (error) throw error;
    return true;
  }
};

/**
 * Task related database operations
 */
export const taskService = {
  // Get all tasks for a project
  async getProjectTasks(projectId) {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_to (
          id,
          username,
          full_name,
          avatar_url
        ),
        task_comments (
          id,
          content,
          created_at,
          user_id (
            id,
            username,
            full_name,
            avatar_url
          )
        )
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  // Get a task by ID
  async getTaskById(taskId) {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_to (
          id,
          username,
          full_name,
          avatar_url
        ),
        task_comments (
          id,
          content,
          created_at,
          user_id (
            id,
            username,
            full_name,
            avatar_url
          )
        )
      `)
      .eq('id', taskId)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Create a new task
  async createTask(taskData) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([taskData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Update a task
  async updateTask(taskId, updates) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Delete a task
  async deleteTask(taskId) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
    
    if (error) throw error;
    return true;
  },
  
  // Add a comment to a task
  async addTaskComment(taskId, userId, content) {
    const { data, error } = await supabase
      .from('task_comments')
      .insert([{
        task_id: taskId,
        user_id: userId,
        content
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  }
};

/**
 * Message related database operations
 */
export const messageService = {
  // Get all messages for a project
  async getProjectMessages(projectId) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Create a new message
  async createMessage(messageData) {
    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Update a message (e.g., pin/unpin)
  async updateMessage(messageId, updates) {
    const { data, error } = await supabase
      .from('messages')
      .update(updates)
      .eq('id', messageId)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Delete a message
  async deleteMessage(messageId) {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);
    
    if (error) throw error;
    return true;
  }
};

/**
 * File related database operations
 */
export const fileService = {
  // Get all files for a project
  async getProjectFiles(projectId) {
    const { data, error } = await supabase
      .from('files')
      .select(`
        *,
        uploaded_by (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('project_id', projectId)
      .order('uploaded_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Upload a new file
  async uploadFile(fileData, fileBuffer) {
    // First upload the file to storage
    const fileName = `${Date.now()}-${fileData.name}`;
    const filePath = `${fileData.project_id}/${fileName}`;
    
    const { error: storageError } = await supabase
      .storage
      .from('project-files')
      .upload(filePath, fileBuffer, {
        contentType: fileData.file_type,
        upsert: false
      });
    
    if (storageError) throw storageError;
    
    // Then create a database record
    const { data, error } = await supabase
      .from('files')
      .insert([{
        ...fileData,
        file_path: filePath
      }])
      .select();
    
    if (error) throw error;
    
    // Get public URL for the file
    const { data: publicURL } = supabase
      .storage
      .from('project-files')
      .getPublicUrl(filePath);
      
    return {
      ...data[0],
      url: publicURL.publicUrl
    };
  },
  
  // Delete a file
  async deleteFile(fileId, filePath) {
    // First remove from storage
    const { error: storageError } = await supabase
      .storage
      .from('project-files')
      .remove([filePath]);
      
    if (storageError) throw storageError;
    
    // Then remove from database
    const { error } = await supabase
      .from('files')
      .delete()
      .eq('id', fileId);
      
    if (error) throw error;
    return true;
  }
};

// Add more services for milestones, events, notes as needed

export default {
  userService,
  projectService,
  taskService,
  messageService,
  fileService
};
