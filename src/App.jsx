import { useState,useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage,useFormik} from 'formik';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [regions, setRegions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [callingCodes, setCallingCodes] = useState([]);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3/all');
        const data = await response.json();
        console.log('response from apis',data)

        // Extract unique regions from the data
        const uniqueRegions = [...new Set(data.map(country => country.region))];

        setRegions(uniqueRegions.filter(region => region.trim() !== ''));
        // Extract unique countries from the data
        const uniqueCountries = data.map(country => country.name.common);
        setCountries(uniqueCountries.filter(country => country.trim() !== ''));
        const uniqueCurrencies = [...new Set(data.map(country => country.currencies[0]))];
        setCurrencies(uniqueCurrencies.filter(currency => currency.trim() !== ''));

        const uniqueCallingCodes = [...new Set(data.map(country => country.callingCodes[0]))];
        setCallingCodes(uniqueCallingCodes.filter(code => code.trim() !== ''));
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    };

    fetchRegions();
  }, []);
  
  const formik = useFormik({
    initialValues: {
      region: '',
      
    },
    onSubmit: (values) => {
      // Handle form submission logic here
      console.log('Form submitted with values:', values);
      // Add your logic for API calls or state updates
      closeModal();
    },
  });

  return (
    <>
    <div className='px-8 border'>
      <h1 className='text-start font-bold text-2xl py-12'>Inventory</h1>
      <div className='flex gap-6 text-xl font-semibold border-b-2 py-4'>
      <h2>Locations</h2>
      <h2>Companies</h2>
      <h2>Stats</h2>
      </div>
      <div className='text-right py-4'>
        <button onClick={openModal} className='rounded-full border border-gray-200 px-2'> <span class="font-bold text-2xl">+</span></button>
      </div>
      <div className='flex gap-6 text-lg font-mediumborder-b-2 py-4'>
      <h3>REGION</h3>
      <h3>COUNTRY</h3>
      <h3>CURRENCY</h3>
      <h3>CALLING CODE</h3>
      </div>
    </div>
    {isModalOpen && (
        <div className='w-96 bg-black  absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'>
        
        <div className='px-8 border'>
        <form onSubmit={formik.handleSubmit}>
          <div className='flex justify-between items-center '>
          <h1 className='text-start font-bold text-2xl py-4'>Add  A Location</h1>
          
          <div className='text-right py-4'>
            <button onClick={closeModal} className='rounded-full border border-gray-200 px-2'>
              <span className="font-bold text-2xl">X</span>
            </button>
          </div>
          </div>
          <div className='mb-4'>
            
           
          <select
                  name="region"
                  value={formik.values.region}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className='mt-1 p-2 border border-gray-300 rounded-md w-full'
                >
                  <option value='' disabled>Select a region</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                
          </div>
          <div className='mb-4'>
          
          <select
                  name="country"
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className='mt-1 p-2 border border-gray-300 rounded-md w-full'
                >
                  <option value='' disabled>Select a country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
          </div>
          <div className='mb-4'>
                {/* Select input for choosing a currency */}
                
                <select
                  name="currency"
                  value={formik.values.currency}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className='mt-1 p-2 border border-gray-300 rounded-md w-full'
                >
                  <option value='' disabled>Select a currency</option>
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
              <div className='mb-4'>
                {/* Select input for choosing a calling code */}
                
                <select
                  name="callingCode"
                  value={formik.values.callingCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className='mt-1 p-2 border border-gray-300 rounded-md w-full'
                >
                  <option value='' disabled>Select a calling code</option>
                  {callingCodes.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>
          <div className='py-4'>
          <button type='submit' className='w-40 text-white bg-black  rounded-2xl py-2'>Add</button>
          </div>
          </form>
        </div>
      </div>
      )}
    </>
  )
}

export default App
