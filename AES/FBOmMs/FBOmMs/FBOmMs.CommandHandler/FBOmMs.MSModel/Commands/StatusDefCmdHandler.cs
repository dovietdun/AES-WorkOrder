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
    public partial class StatusDefCmdHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private StatusDefCmd.Response StatusDefCmdHandler(StatusDefCmd command)
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
                return new StatusDefCmd.Response();
            }
            catch (Exception ex)
            {
                return new StatusDefCmd.Response();
            }
        }
        private void AddData(StatusDefCmd command)
        {
            var existingItem = platform.Query<IStatusDef>()

                                .Where(x => x.NId == command.StatusCmd.NId).FirstOrDefault();

            if (existingItem == null)
            {
                var createItem = platform.Create<IStatusDef>();
                createItem.NId = command.StatusCmd.NId;
                createItem.Name = command.StatusCmd.Name;


                platform.Submit(createItem);
            }
            throw new NotImplementedException();
        }

        private void UpdateData(StatusDefCmd command)
        {
            var ededittingItem = platform.GetEntity<IStatusDef>(command.CmdId.GetValueOrDefault());
            if (ededittingItem == null)
                throw new Exception($"xx");
            ededittingItem.NId = command.StatusCmd.NId;
            ededittingItem.Name = command.StatusCmd.Name;

            platform.Submit(ededittingItem);
            throw new NotImplementedException();
        }

        private void DeleteData(StatusDefCmd command)
        {
            var deletingItem = platform.GetEntity<IStatusDef>(command.CmdId.GetValueOrDefault());
            if (deletingItem == null)
                throw new Exception($"Id {command.CmdId} is not found");
            platform.Delete(deletingItem);
            throw new NotImplementedException();
        }
    }
   
}
