import {render} from '@testing-library/react-native'
import {IconButton} from './IconButton'

describe('<IconButton />', () => {
    it('Should match snapshot', () => {
        const rendered = render(
            <IconButton
            iconType='Feather'
            iconSize={24}
            iconName='arrow-left'
            />
        )
        // @ts-ignore
        expect(rendered.toJSON()).toMatchSnapshot()
    })
})
