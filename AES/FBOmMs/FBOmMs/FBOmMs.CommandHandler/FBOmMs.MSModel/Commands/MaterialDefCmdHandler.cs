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
    public partial class MaterialDefCmdHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private MaterialDefCmd.Response MaterialDefCmdHandler(MaterialDefCmd cmd)
        {
            try
            {
                switch (cmd.Action)
                {

                    case "ADD":
                        AddData(cmd);
                        break;
                    case "UPDATE":
                        UpdateData(cmd);
                        break;
                    case "DELETE":
                        DeleteData(cmd);
                        break;
                    default:
                        break;
                }
                return new MaterialDefCmd.Response();
            }
            catch (Exception ex)
            {
                return new MaterialDefCmd.Response();
            }
        }
        private void AddData(MaterialDefCmd cmd)
        {
           
            var existingItem = platform.Query<IMaterialDef>()

                                .Where(x => x.NId == cmd.MaterialCmd.NId).FirstOrDefault();

            if (existingItem == null)
            {
                var createItem = platform.Create<IMaterialDef>();
                createItem.NId = cmd.MaterialCmd.NId;
                createItem.Name = cmd.MaterialCmd.Name;


                platform.Submit(createItem);
            }
            throw new NotImplementedException();
        }

        private void UpdateData(MaterialDefCmd cmd)
        {
            var ededittingItem = platform.GetEntity<IMaterialDef>(cmd.CmdId.GetValueOrDefault());
            if (ededittingItem == null)
                throw new Exception($"xx");
            ededittingItem.NId = cmd.MaterialCmd.NId;
            ededittingItem.Name = cmd.MaterialCmd.Name;

            platform.Submit(ededittingItem);
            throw new NotImplementedException();
        }

        private void DeleteData(MaterialDefCmd cmd)
        {
            var deletingItem = platform.GetEntity<IMaterialDef>(cmd.CmdId.GetValueOrDefault());
            if (deletingItem == null)
                throw new Exception($"Id {cmd.CmdId} is not found");
            platform.Delete(deletingItem);
            throw new NotImplementedException();
        }
    }
}
