
import './App.css'
import MyCard from './components/MyCard'
import { ThemeProvider } from "@/components/theme-provider"
function App() {


  return (
  <div className='flex justify-center mt-40'>
        <ThemeProvider  defaultTheme="dark" storageKey="vite-ui-theme">
          <MyCard/>
      </ThemeProvider>
</div>
  )
}

export default App
