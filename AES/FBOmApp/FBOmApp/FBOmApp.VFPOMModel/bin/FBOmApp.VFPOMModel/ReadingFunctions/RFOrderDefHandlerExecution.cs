using System;

using Siemens.SimaticIT.Unified.Common;
using Siemens.SimaticIT.Unified;

namespace VF.FBOmApp.FBOmApp.VFPOMModel.ReadingFunctions
{
    /// <summary>
    /// Class initialize
    /// </summary>
    public partial class RFOrderDefHandlerShell : IReadingFunctionHandler
    {
        private IUnifiedSdkReadingFunction  Platform;
        
        /// <summary>
        /// Execute
        /// </summary>
        /// <param name="unifiedSdk"></param>
        /// <param name="readingFunction"></param>
        /// <returns></returns>
        public FunctionResponse Execute(IUnifiedSdkReadingFunction unifiedSdk, IReadingFunction readingFunction)
        {
            this.Platform = unifiedSdk;

            return RFOrderDefHandler((RFOrderDef)readingFunction);
        }

        /// <summary>
        /// Retrieve the type of the readingFunction
        /// </summary>
        public global::System.Type GetReadingFunctionType()
        {
            return typeof(RFOrderDef);
        }
    }
}
