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
    public partial class UploadCmdHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private UploadCmd.Response UploadCmdHandler(UploadCmd command)
        {
            try
            {
                switch (command.Action)
                {
                    case "LOADDATAFE":
                        UpdateDataFE(command);
                        break;
                    case "LOADDATABE":
                        UpdateDataBE(command);
                        break;

                    default:
                        break;


                }
            }
            catch (Exception ex)
            {
                return new UploadCmd.Response();
            }
            return new UploadCmd.Response();
        }

        private void UpdateDataBE(UploadCmd command)
        {
            var csvData = command.Data;
            string[] stringSeparators = new string[] { "\r\n" };

            string[] records = csvData.Split(stringSeparators, StringSplitOptions.None);
            foreach(var items in records)
            {
                string[] parts = items.Split(',');
                if(parts[1] == "ProductionOrder")
                {
                    var newItem = platform.Create<IProductionOrder>();
                    newItem.NId = parts[0];
                    newItem.Type = parts[1];
                    newItem.Status = parts[2];
                    newItem.MaterialFinal = parts[3];
                    newItem.PlanStartDate = Convert.ToDateTime(parts[4]);
                    newItem.PlanEndDate = Convert.ToDateTime(parts[5]);
                    newItem.Quantity = Convert.ToInt32(parts[6]);

                    platform.Submit(newItem);
                }else if (parts[1] == "BatchOrder")
                {
                    var newItem = platform.Create<IBatchOrder>();
                    newItem.NId = parts[0];
                    newItem.Type = parts[1];
                    newItem.Status = parts[2];
                    newItem.MaterialFinal = parts[3];
                    newItem.PlanStartDate = Convert.ToDateTime(parts[4]);
                    newItem.PlanEndDate = Convert.ToDateTime(parts[5]);
                    newItem.Quantity = Convert.ToInt32(parts[6]);

                    platform.Submit(newItem);
                }
              
            }


        }

        private void UpdateDataFE(UploadCmd command)
        {
            
            throw new NotImplementedException();
        }
       
    }
}
