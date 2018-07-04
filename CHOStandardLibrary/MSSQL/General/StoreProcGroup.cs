using System;
using System.Data;
using System.Data.SqlClient;
using System.Transactions;

namespace CHOStandardLibrary.MSSQL.General
{
    namespace CHOCore.Utilities.MSSQL
    {
        /// <summary>
        /// for usage examples, please refer to offlineTables.cs as a template
        /// </summary>
        public class StoreProcGroup
        {
            string _connString;
            public StoreProcGroup(string connectionString)
            {
                _connString = connectionString;
            }
            protected SqlConnection getConnection(bool autoOpen = false)
            {
                var con = new SqlConnection(_connString);
                if (autoOpen && con != null && con.State != ConnectionState.Open) con.Open();
                return con;
            }
            protected static SqlCommand getCommand(SqlConnection con, string storeProcName)
            {
                con.Open();
                var command = new SqlCommand();
                command.Connection = con;
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = storeProcName;
                return command;
            }
            public static TransactionOptions getTransactionOption(System.Transactions.IsolationLevel isolationLevel = System.Transactions.IsolationLevel.ReadCommitted, int minutes = 10)
            {
                var option = new TransactionOptions();
                option.IsolationLevel = isolationLevel;
                option.Timeout = TimeSpan.FromMinutes(minutes);
                return option;
            }
        }
    }
}
