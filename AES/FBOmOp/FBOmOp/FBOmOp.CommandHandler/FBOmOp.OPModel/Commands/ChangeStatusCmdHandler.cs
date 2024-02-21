using System;
using System.Collections.Generic;
using System.Linq;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Siemens.SimaticIT.Handler;
using Siemens.SimaticIT.Unified;
using VF.OperationalData.FBOmOp.OPModel.DataModel;

namespace VF.OperationalData.FBOmOp.OPModel.Commands
{
    /// <summary>
    /// Partial class init
    /// </summary>
    [Handler(HandlerCategory.BasicMethod)]
    public partial class ChangeStatusCmdHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private ChangeStatusCmd.Response ChangeStatusCmdHandler(ChangeStatusCmd command)
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
                return new ChangeStatusCmd.Response();
            }
            catch (Exception ex)
            {
                return new ChangeStatusCmd.Response();
            }
        }
        private void AddData(ChangeStatusCmd command)
        {
            var existingItem = platform.Query<IChangeStatus>()

                               .Where(x => x.ChangeStatusID == command.ChangeCmd.NId).FirstOrDefault();

            if (existingItem == null)
            {
                var createItem = platform.Create<IChangeStatus>();
                createItem.ChangeStatusID = command.ChangeCmd.NId;
                createItem.OrderType = command.ChangeCmd.OrderType;
                createItem.FromStatus = command.ChangeCmd.FromStatus;
                createItem.ToStatus = command.ChangeCmd.ToStatus;

                platform.Submit(createItem);
            }
            throw new NotImplementedException();
        }
        private void UpdateData(ChangeStatusCmd command)
        {
            var ededittingItem = platform.GetEntity<IChangeStatus>(command.CmdId.GetValueOrDefault());
            if (ededittingItem == null)
                throw new Exception($"xx");
            ededittingItem.ChangeStatusID = command.ChangeCmd.NId;
            ededittingItem.OrderType = command.ChangeCmd.OrderType;
            ededittingItem.FromStatus = command.ChangeCmd.FromStatus;
            ededittingItem.ToStatus = command.ChangeCmd.ToStatus;

            platform.Submit(ededittingItem);
            throw new NotImplementedException();
        }
        private void DeleteData(ChangeStatusCmd command)
        {
            var deletingItem = platform.GetEntity<IChangeStatus>(command.CmdId.GetValueOrDefault());
            if (deletingItem == null)
                throw new Exception($"Id {command.CmdId} is not found");
            platform.Delete(deletingItem);
            throw new NotImplementedException();
        }
    }
}
