import { useState } from 'react'
import Input from '@/components/atoms/Input'

const SearchBar = ({ onSearch, placeholder = "Search..." }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  return (
    <div className="w-full max-w-md">
      <Input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder={placeholder}
        icon="Search"
        className="bg-white"
      />
    </div>
  )
}

export default SearchBar