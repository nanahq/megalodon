import {render} from '@testing-library/react-native'
import {TextInputWithLabel} from './TextInputWithLabel'


describe('<TextInputWithLabel />', () => {
    it('Should match snapshot', () => {
        const rendered = render(<TextInputWithLabel label="Test Id" labelTestId='TextInputWithLabel.Test' />)
        // @ts-ignore
        expect(rendered.toJSON()).toMatchSnapshot()
    })
})
