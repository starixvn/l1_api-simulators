using OW.ApiSimulator.Models.Saba;

namespace OW.ApiSimulator.Models
{
    public class AddSpinViewModel
    {
        public AddSpinRequest Request { get; set; } = new AddSpinRequest();

        public SabaResponse<AddSpinResult> Result { get; set; }
    }
}
