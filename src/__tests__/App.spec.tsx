import '@testing-library/jest-dom'
import { render } from "@testing-library/react"
import App from "../App"

test("Renders the main page", () => {
    render(<App />)
    expect(true).toBeTruthy()
})

test("Renders the main page", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/App/i);
  expect(linkElement).toBeInTheDocument();
})