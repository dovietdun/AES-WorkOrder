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
    public partial class SplitCmdHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private SplitCmd.Response SplitCmdHandler(SplitCmd command)
        {

            // Put your code here
            // return new SplitOrderCmd.Response() { ... };
            try
            {
                switch (command.Action)
                {
                    case "SPLIT":
                        handleSplit(command);
                        break;
                }
            }
            catch (Exception ex)
            {
                return new SplitCmd.Response();
            }
            return new SplitCmd.Response();
        }

        private void handleSplit(SplitCmd command)
        {
            DateTime now = DateTime.Now;
            int k = 1;
            List<IOrderDef> insertList = new List<IOrderDef>();
           // var itemBatch = platform.Query<IBatchOrder>(command.CmdId.GetValueOrDefault());
            var itemBatch = platform.Query<IOrderDef>()
                              .Where(x => x.NId == command.SplitCmd_.NId).FirstOrDefault();

            for (int i = 0; i < command.SplitCmd_.Quantity; i++)
            {
                if (command.SplitCmd_.Type == "BatchOrder" && command.SplitCmd_.Status == "Initial")
                {
                   // var itemBatch = platform.GetEntity<IBatchOrder>(command.CmdId.GetValueOrDefault());


                    var itemSplit = platform.Create<IProductionOrder>();
                    itemSplit.NId = command.SplitCmd_.NId + "_" + k;
                    itemSplit.ParrentId = command.SplitCmd_.NId;
                    itemSplit.Type = "ProductionOrder";
                    itemSplit.Status = command.SplitCmd_.Status;
                    itemSplit.MaterialFinal = command.SplitCmd_.MaterialFinal;
                    itemSplit.PlanStartDate = now;
                    itemSplit.PlanEndDate = now;
                    itemSplit.PlanStartDate = now;
                    itemSplit.PlanEndDate = now;
                    itemSplit.Quantity = 1;
                    itemSplit.SerialNumber = "";

                    //itemBatch.Status = "Split";

                    //platform.Submit(itemBatch);
                    insertList.Add(itemSplit);
                    k++;
                }
            }
            itemBatch.Status = "Split";
            platform.Submit(itemBatch);
            platform.BulkImport(insertList, new BulkImportOptions() { });
            // throw new NotImplementedException();
        }
    }
}
