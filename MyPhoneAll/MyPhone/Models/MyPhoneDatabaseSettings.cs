namespace MyPhoneAPI.Models;

public class MyPhoneDatabaseSettings
{
    public string ConnectionString { get; set; }
    public string DatabaseName { get; set; }
    public string PhonesCollectionName { get; set; }
    public string SellersCollectionName { get; set; }

    public string ClientsCollectionName { get; set; }
}
