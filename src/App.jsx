import { useState, useEffect } from "react";
import { useFormik } from "formik";
import "./App.css";
import { Cross1Icon, PlusCircledIcon } from "@radix-ui/react-icons";
function App() {
  const [apiResponse, setApiResponse] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [regions, setRegions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [callingCodes, setCallingCodes] = useState([]);
  const [data, setData] = useState([]);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3/all");
        const data = await response.json();
        setApiResponse(data);

        // Extract unique regions from the data
        const uniqueRegions = [
          ...new Set(data.map((country) => country.region)),
        ];

        setRegions(uniqueRegions.filter((region) => region.trim() !== ""));
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };

    fetchRegions();
  }, []);

  const formik = useFormik({
    initialValues: {
      region: "",
    },
    onSubmit: (values) => {
      // Handle form submission logic here
      setData([...data, values]);
      // Add your logic for API calls or state updates
      closeModal();
      // Reset form fields
      formik.resetForm();
    },
  });

  const fetchListOfCountries = function (region) {
    // return country.common.name
    let countryList = apiResponse
      .filter((country) => country.region === region)
      .map((country) => country.name.common);

    countryList.unshift("Select a country");

    return countryList;
  };

  const handleRegionChange = (event) => {
    formik.handleChange(event);
    setCountries(fetchListOfCountries(event.target.value));
  };
  const fetchCurrencies = function (name) {
    let countryData = apiResponse.filter(
      (country) => country.name.common === name
    );
    const currencyKeys = Object.keys(countryData[0].currencies);

    // loop over currencyKeys and return all currency names
    const currencyNames = currencyKeys.map((key) => {
      return countryData[0].currencies[key].name;
    });
    currencyNames.unshift("Select a currency");
    return currencyNames;
  };
  const fetchCallingCode = function (name) {
    let countryData = apiResponse.filter(
      (country) => country.name.common === name
    );
    let callingCode = [
      countryData[0].idd.root + countryData[0].idd.suffixes[0],
    ];
    callingCode.unshift("Select a calling code");
    return callingCode;
  };
  const handleCountryChange = (event) => {
    formik.handleChange(event);
    setCurrencies(fetchCurrencies(event.target.value));
    setCallingCodes(fetchCallingCode(event.target.value));
  };
  return (
    <>
      <div className="px-8">
        <h1 className="text-start font-bold text-2xl py-12">Inventory</h1>
        <div className="flex gap-6 text-xl font-semibold border-b-2">
          <h2 className="border-blue-700 border-b-2 py-4">Locations</h2>
          <h2 className="py-4">Companies</h2>
          <h2 className="py-4">Stats</h2>
        </div>
        <div className=" py-4">
          
          <PlusCircledIcon className="h-8 w-8 ml-auto" onClick={openModal} />
        </div>
        <div className="flex gap-6 text-lg font-mediumborder-b-2 py-4">
          {/* Table */}
          <table className="min-w-full table-auto">
            <thead className="border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Currency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Calling Code
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 text-left py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.region}
                  </td>
                  <td className="px-6 text-left py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.country}
                  </td>
                  <td className="px-6 text-left py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.currency}
                  </td>
                  <td className="px-6 text-left py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.callingCode}
                  </td>
                  <td className="px-6 text-left py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <button className="">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <div className="w-96 bg-gray-200  absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
          <div className="p-8 border">
            <form onSubmit={formik.handleSubmit}>
              <div className="flex justify-between items-center ">
                <h1 className="text-start font-bold text-2xl pb-4">
                  Add A Location
                </h1>

                <div className="text-right pb-4">
                  <button
                    onClick={closeModal}
                    className="rounded-full border border-gray-200 px-2"
                  >
                    <Cross1Icon />
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <select
                  name="region"
                  value={formik.values.region}
                  onChange={handleRegionChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                >
                  <option value="" disabled>
                    Select a region
                  </option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <select
                  name="country"
                  value={formik.values.country}
                  onChange={handleCountryChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                >
                  <option value="" disabled>
                    Select a country
                  </option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                {/* Select input for choosing a currency */}
                <select
                  name="currency"
                  value={formik.values.currency}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                >
                  <option value="" disabled>
                    Select a currency
                  </option>
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                {/* Select input for choosing a calling code */}
                <select
                  name="callingCode"
                  value={formik.values.callingCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                >
                  <option value="" disabled>
                    Select a calling code
                  </option>
                  {callingCodes.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>
              <div className="">
                <button
                  type="submit"
                  className="w-40 text-white bg-black  rounded-2xl py-2"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default App;