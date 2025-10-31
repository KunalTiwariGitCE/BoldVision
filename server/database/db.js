import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  server: process.env.AZURE_SQL_SERVER,
  database: process.env.AZURE_SQL_DATABASE,
  user: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASSWORD,
  port: parseInt(process.env.AZURE_SQL_PORT || '1433'),
  options: {
    encrypt: true, // Use encryption for Azure
    trustServerCertificate: false,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool = null;

export async function getConnection() {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log('Connected to Azure SQL Database');
    }
    return pool;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

export async function initDatabase() {
  try {
    const connection = await getConnection();

    // Create Contacts table
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Contacts' AND xtype='U')
      CREATE TABLE Contacts (
        ContactID INT PRIMARY KEY IDENTITY(1,1),
        Name NVARCHAR(255) NOT NULL,
        Email NVARCHAR(255),
        Phone NVARCHAR(50),
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME DEFAULT GETDATE()
      )
    `);

    // Create Conversations table
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Conversations' AND xtype='U')
      CREATE TABLE Conversations (
        ConversationID INT PRIMARY KEY IDENTITY(1,1),
        ContactID INT,
        SessionID NVARCHAR(100) UNIQUE NOT NULL,
        StartTime DATETIME DEFAULT GETDATE(),
        EndTime DATETIME,
        FOREIGN KEY (ContactID) REFERENCES Contacts(ContactID)
      )
    `);

    // Create Messages table
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Messages' AND xtype='U')
      CREATE TABLE Messages (
        MessageID INT PRIMARY KEY IDENTITY(1,1),
        ConversationID INT NOT NULL,
        Role NVARCHAR(20) NOT NULL,
        Content NVARCHAR(MAX) NOT NULL,
        Timestamp DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (ConversationID) REFERENCES Conversations(ConversationID)
      )
    `);

    // Create index for faster queries
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='idx_session' AND object_id = OBJECT_ID('Conversations'))
      CREATE INDEX idx_session ON Conversations(SessionID)
    `);

    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='idx_conversation' AND object_id = OBJECT_ID('Messages'))
      CREATE INDEX idx_conversation ON Messages(ConversationID)
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

export async function createContact(name, email, phone) {
  try {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('phone', sql.NVarChar, phone)
      .query(`
        INSERT INTO Contacts (Name, Email, Phone)
        OUTPUT INSERTED.ContactID
        VALUES (@name, @email, @phone)
      `);

    return result.recordset[0].ContactID;
  } catch (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
}

export async function createConversation(contactId, sessionId) {
  try {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input('contactId', sql.Int, contactId)
      .input('sessionId', sql.NVarChar, sessionId)
      .query(`
        INSERT INTO Conversations (ContactID, SessionID)
        OUTPUT INSERTED.ConversationID
        VALUES (@contactId, @sessionId)
      `);

    return result.recordset[0].ConversationID;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
}

export async function getConversationBySession(sessionId) {
  try {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input('sessionId', sql.NVarChar, sessionId)
      .query(`
        SELECT ConversationID, ContactID, SessionID, StartTime
        FROM Conversations
        WHERE SessionID = @sessionId
      `);

    return result.recordset[0];
  } catch (error) {
    console.error('Error getting conversation:', error);
    throw error;
  }
}

export async function saveMessage(conversationId, role, content) {
  try {
    const connection = await getConnection();
    await connection
      .request()
      .input('conversationId', sql.Int, conversationId)
      .input('role', sql.NVarChar, role)
      .input('content', sql.NVarChar, content)
      .query(`
        INSERT INTO Messages (ConversationID, Role, Content)
        VALUES (@conversationId, @role, @content)
      `);
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}

export async function getConversationHistory(conversationId) {
  try {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input('conversationId', sql.Int, conversationId)
      .query(`
        SELECT MessageID, Role, Content, Timestamp
        FROM Messages
        WHERE ConversationID = @conversationId
        ORDER BY Timestamp ASC
      `);

    return result.recordset;
  } catch (error) {
    console.error('Error getting conversation history:', error);
    throw error;
  }
}

export async function updateContactInfo(contactId, email, phone) {
  try {
    const connection = await getConnection();
    await connection
      .request()
      .input('contactId', sql.Int, contactId)
      .input('email', sql.NVarChar, email)
      .input('phone', sql.NVarChar, phone)
      .query(`
        UPDATE Contacts
        SET Email = @email, Phone = @phone, UpdatedAt = GETDATE()
        WHERE ContactID = @contactId
      `);
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
}

export default { getConnection, initDatabase, createContact, createConversation, saveMessage };
