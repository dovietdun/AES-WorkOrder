
using System;
using System.Collections.Generic;
using System.Linq;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Siemens.SimaticIT.Handler;
using Siemens.SimaticIT.Unified;
using VF.OperationalData.FBOmOp.OPModel.Types;
using VF.FBOmApp.FBOmApp.VFPOMModel.DataModel.ReadingModel;

namespace VF.FBOmApp.FBOmApp.VFPOMModel.ReadingFunctions
{
    /// <summary>
    /// Partial class init
    /// </summary>
    [Handler(HandlerCategory.BasicMethod)]
    public partial class RFOrderDefHandlerShell 
    {
        /// <summary>
        /// This is the handler the MES engineer should write
        /// This is the ENTRY POINT for the user in VS IDE
        /// </summary>
        /// <param name="readingFunction"></param>
        /// <returns></returns>
        [HandlerEntryPoint]
        private FunctionResponse<RFOrderDef.FunctionResponse> RFOrderDefHandler(RFOrderDef readingFunction)
        {
           IQueryable<OrderDefPrm> query;
            var productionOrders = Platform.ProjectionQuery<ProductionOrder>()
                                .Select(s => new OrderDefPrm()
                                {
                                    Id = s.Id,
                                    NId = s.NId,
                                    Type = s.Type,
                                    Status = s.Status,
                                    MaterialFinal = s.MaterialFinal,
                                    PlanStartDate = s.PlanStartDate,
                                    PlanEndDate = s.PlanEndDate,
                                    ActualStartDate = s.ActualStartDate,
                                    ActualEndDate = s.ActualEndDate,
                                    Quantity = (int)s.Quantity,
                                    ParrentId = s.ParrentId,
                                    BatchID = s.Facets.OfType<BatchManagement>()
                                        .Select(x => x.BatchID).FirstOrDefault(),
                                    SerialNumber = s.SerialNumber,
                                });
            var batchOrders = Platform.ProjectionQuery<BatchOrder>()
                               .Select(s => new OrderDefPrm()
                               {
                                   Id = s.Id,
                                   NId = s.NId,
                                   Type = s.Type,
                                   Status = s.Status,
                                   MaterialFinal = s.MaterialFinal,
                                   PlanStartDate = s.PlanStartDate,
                                   PlanEndDate = s.PlanEndDate,
                                   ActualStartDate = s.ActualStartDate,
                                   ActualEndDate = s.ActualEndDate,
                                   Quantity = (int)s.Quantity,
                                   ParrentId = s.ParrentId,
                                   BatchID = null,
                                   SerialNumber = null,
                               });

            switch (readingFunction.Type)
            {
                case "ProductionOrder":
                    query = productionOrders;
                    break;
                case "BatchOrder":
                    query = batchOrders;
                    break;
                default:
                    query = productionOrders.Union(batchOrders);
                    break;
            }
            if (!string.IsNullOrEmpty(readingFunction.Type))
            {
                query = productionOrders.Where(x => x.Type == readingFunction.Type);
            }
            if (!string.IsNullOrEmpty(readingFunction.Status))
            {
                query = productionOrders.Where(x => x.Status == readingFunction.Status);
            }
            if (!string.IsNullOrEmpty(readingFunction.SerialNumber))
            {
                query = productionOrders.Where(x => x.SerialNumber == readingFunction.SerialNumber);
            }
            if (!string.IsNullOrEmpty(readingFunction.ParentID))
            {
                query = productionOrders.Where(x => x.ParrentId == readingFunction.ParentID);
            }
            if (!string.IsNullOrEmpty(readingFunction.SerialNumber))
            {
                query = productionOrders.Where(x => x.SerialNumber == readingFunction.SerialNumber);
            }


            var data = query.ToList();

            return new FunctionResponse<RFOrderDef.FunctionResponse>()
            {
                Data = new List<RFOrderDef.FunctionResponse>()
                {
                    new RFOrderDef.FunctionResponse()
                    {
                        Results =  data
                    }
                }.AsQueryable()
            };


        }
    }
}
