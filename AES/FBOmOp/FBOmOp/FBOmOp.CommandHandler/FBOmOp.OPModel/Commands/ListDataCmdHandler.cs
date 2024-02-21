using System;
using System.Collections.Generic;
using System.Linq;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Siemens.SimaticIT.Handler;
using Siemens.SimaticIT.Unified;
using VF.OperationalData.FBOmOp.OPModel.DataModel;
using VF.OperationalData.FBOmOp.OPModel.Types;

namespace VF.OperationalData.FBOmOp.OPModel.Commands
{
    /// <summary>
    /// Partial class init
    /// </summary>
    [Handler(HandlerCategory.BasicMethod)]
    public partial class ListDataCmdHandlerShell
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private ListDataCmd.Response ListDataCmdHandler(ListDataCmd command)
        {
            try
            {
                switch (command.Action)
                {
                    case "GEN_BATCH":
                        GenBatch(command);
                        break;
                    case "changeStatus":
                        changeStatus(command);
                        break;
                    case "Scrapp":
                        Scrapp(command);
                        break;

                    default:
                        break;
                }
                return new ListDataCmd.Response();
            }
            catch (Exception ex)
            {
                return new ListDataCmd.Response();
            }
        }
        private void GenBatch(ListDataCmd command)
        {
            var selecteds = command.Data.ToList();
            string now = DateTime.Now.ToString("_yyyyMMdd"); ;
            string finalMaterial = selecteds[0].MaterialFinal;

            int index = 1;
            try
            {
                var maxIndex = platform.Query<IBatchManagement>()
                    .Where(x => x.BatchID.Contains(now))
                    .Select(s => s.BatchID.Substring(s.BatchID.Length - 4, 4))
                    .Max();
                index = Convert.ToInt32(maxIndex) + 1;
            }
            catch (Exception)
            {
            }
            string newBatchID = "LOT_" + finalMaterial + now + index.ToString("0000");

            foreach (var item in selecteds)
            {
                var newBatch = platform.Create<IBatchManagement>();
                newBatch.BatchID = newBatchID;

                var production = platform.GetEntity<IProductionOrder>(item.Id.GetValueOrDefault());
                production.Facets.Add(newBatch);


                platform.Submit(production);
            }
        }
        private void changeStatus(ListDataCmd command)
        {

            DateTime now = DateTime.Now;
            var selecteds = command.Data.ToList();

            string orderType = selecteds[0].Type;
            string currentStatus = selecteds[0].Status;
            var status = platform.Query<IChangeStatus>()
                        .Where(x => x.OrderType == orderType
                        && x.FromStatus == currentStatus).FirstOrDefault();
            switch (status.ToStatus)
            {
                case "Active":
                    // Create Serial Number
                    var index = 1;
                    try
                    {
                        string datetime = DateTime.Now.ToString("_yyyyMMdd_");
                        var maxSerialNumber = platform.Query<IProductionOrder>()
                                                        .Where(x => x.SerialNumber.Contains(datetime))
                                                        .Select(x => x.SerialNumber).Max();
                        var max = maxSerialNumber.Substring(maxSerialNumber.Length - 4, 4);
                        index = Convert.ToInt32(max) + 1;
                    }
                    catch
                    {
                        //throw new Exception($"xx");
                    }
                    foreach (var temp in selecteds)
                    {
                        var itemProduction = platform.GetEntity<IProductionOrder>(temp.Id.GetValueOrDefault());
                        itemProduction.Status = status.ToStatus;
                        itemProduction.SerialNumber = temp.MaterialFinal + now.ToString("_yyyyMMdd_") + index.ToString("0000");
                        platform.Submit(itemProduction);
                    }
                    break;
                case "InProgress":
                    foreach (var temp in selecteds)
                    {
                        var itemProduction = platform.GetEntity<IProductionOrder>(temp.Id.GetValueOrDefault());
                        itemProduction.Status = status.ToStatus;
                        itemProduction.ActualStartDate = DateTime.Today;

                        platform.Submit(itemProduction);
                    }
                    break;
                case "Completed":
                    foreach (var temp in selecteds)
                    {
                        var itemProduction = platform.GetEntity<IProductionOrder>(temp.Id.GetValueOrDefault());
                        itemProduction.Status = status.ToStatus;
                        itemProduction.ActualEndDate = DateTime.Today;

                        platform.Submit(itemProduction);
                        var itemBatch = command.Data.ToList();
                        string itemBatchID = itemBatch[0].BatchID;
                        var addDataWhileList = platform.Create<IWhiteListSerialNumber>();
                        addDataWhileList.NId = itemProduction.NId;
                        addDataWhileList.SerialNumber = itemProduction.SerialNumber;
                        addDataWhileList.FinalMaterial = itemProduction.MaterialFinal;
                        addDataWhileList.ActualStartDate = itemProduction.ActualStartDate;
                        addDataWhileList.ActualEndDate = itemProduction.ActualEndDate;
                        addDataWhileList.BatchId = itemBatchID;

                        platform.Submit(addDataWhileList);

                        // Completed Batch if all childs Status are Completed And Scrapp
                        if (orderType == "ProductionOrder")
                        {
                            UpdateParentStatus(selecteds, now);
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        private void UpdateParentStatus(List<OrderDefPrm> selecteds, DateTime now)
        {
            var parents = selecteds.Where(x => x.ParrentId != null).Select(s => s.ParrentId).Distinct();

            foreach (var item in parents)
            {
                var batch = platform.Query<IBatchOrder>().Where(x => x.ParrentId == item).FirstOrDefault();

                string[] arr = { "Completed", "Scrapp" };

                var cntScCo = platform.Query<IProductionOrder>().Count(x => x.ParrentId == item && arr.Contains(x.Status));
                if (cntScCo == batch.Quantity)
                {
                    batch.Status = "Completed";
                    batch.ActualEndDate = now;
                    platform.Submit(batch);
                }
            }
        }

        private void Scrapp(ListDataCmd command)
        {
            var selecteds = command.Data.ToList();

           foreach(var item in selecteds)
            {

                var itemScrapp = platform.GetEntity<IProductionOrder>(item.Id.GetValueOrDefault());
                itemScrapp.Status = "Scrapp";
                itemScrapp.ActualEndDate = DateTime.Today;
                platform.Submit(itemScrapp);
            }
            throw new NotImplementedException();
        }

    }
}
