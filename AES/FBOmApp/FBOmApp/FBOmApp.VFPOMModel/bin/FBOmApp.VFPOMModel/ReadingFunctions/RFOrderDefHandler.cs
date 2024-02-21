
using System;
using System.Collections.Generic;
using System.Linq;
using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified.Common.Information;
using Siemens.SimaticIT.Handler;
using Siemens.SimaticIT.Unified;

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

            // Put your code here
			// return new FunctionResponse<RFOrderDef.FunctionResponse>();
            throw new NotImplementedException(); 
                     
        }
    }
}
