import Papa from 'papaparse'
import { useRef, useState } from 'react'
import { useAppContext } from '../AppContext'
import { fetchSellPrice } from '../utils/stockData'

const UploadCSV = () => {
  const { setPortfolioData } = useAppContext()
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)
  
  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        if (result.errors.length) {
          setError('Invalid CSV format')
        } else {
          try {
            const groupedData = await result.data.reduce(async (accPromise, row) => {
              const acc = await accPromise
              if (!acc[row.Account]) {
                acc[row.Account] = []
              }

              const newRow = { ...row }
              if (row['Sell Date'] !== 'None') {
                const sellPrice = await fetchSellPrice(row.Ticker, row['Sell Date'], row['Cost Basis'])
                newRow.SellPrice = sellPrice
              }
              acc[row.Account].push(newRow)
              return acc
            }, Promise.resolve({}))
            setError(null)
            setPortfolioData(groupedData)
          } catch (error) {
            console.error('Error processing CSV data:', error)
            setError('Failed to process CSV data')
          }
          fileInputRef.current.value = '' // Clear file input
        }
      }
    })
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type='file'
        accept='.csv'
        onChange={handleFileUpload}
        className='hidden'
      />
      <button
        onClick={triggerFileInput}
        className='btn btn-sm btn-neutral text-white w-full justify-start hover:btn-active opacity-80 transition-opacity duration-300'
      >
        Upload CSV File
      </button>
      {error && <p className='text-error text-sm mt-1'>{error}</p>}
    </>
  )
}

export default UploadCSV
