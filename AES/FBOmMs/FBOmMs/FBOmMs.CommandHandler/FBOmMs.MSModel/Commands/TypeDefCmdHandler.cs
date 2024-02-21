using System;
using System.Collections.Generic;
using System.Linq;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Siemens.SimaticIT.Handler;
using Siemens.SimaticIT.Unified;
using VF.MasterData.FBOmMs.MSModel.DataModel;

namespace VF.MasterData.FBOmMs.MSModel.Commands
{
    /// <summary>
    /// Partial class init
    /// </summary>
    [Handler(HandlerCategory.BasicMethod)]
    public partial class TypeDefCmdHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private TypeDefCmd.Response TypeDefCmdHandler(TypeDefCmd command)
        {
            try
            {
                switch (command.Action)
                {

                    case "ADD":
                        AddData(command);
                        break;
                    case "UPDATE":
                        UpdateData(command);
                        break;
                    case "DELETE":
                        DeleteData(command);
                        break;
                    default:
                        break;
                }
                return new TypeDefCmd.Response();
            }
            catch (Exception ex)
            {
                return new TypeDefCmd.Response();
            }
        }

        private void AddData(TypeDefCmd command)
        {
            var existingItem = platform.Query<ITypeDef>()

                               .Where(x => x.NId == command.TypeCmd.NId).FirstOrDefault();

            if (existingItem == null)
            {
                var createItem = platform.Create<ITypeDef>();
                createItem.NId = command.TypeCmd.NId;
                createItem.Name = command.TypeCmd.Name;


                platform.Submit(createItem);
            }
            throw new NotImplementedException();
        }
       
        private void UpdateData(TypeDefCmd command)
        {
            var ededittingItem = platform.GetEntity<ITypeDef>(command.CmdId.GetValueOrDefault());
            if (ededittingItem == null)
            {
                throw new Exception($"xx");
            }
                
            ededittingItem.NId = command.TypeCmd.NId;
            ededittingItem.Name = command.TypeCmd.Name;


            platform.Submit(ededittingItem);
           // throw new NotImplementedException();
        }

        private void DeleteData(TypeDefCmd command)
        {
            var deletingItem = platform.GetEntity<ITypeDef>(command.CmdId.GetValueOrDefault());
            if (deletingItem == null)
            {
                throw new Exception($"not");
            }
              
            platform.Delete(deletingItem);
            //throw new NotImplementedException();
        }

        

       
     
    }



}
