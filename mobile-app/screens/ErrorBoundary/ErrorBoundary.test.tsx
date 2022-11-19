import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import ErrorBoundary from "./ErrorBoundary";

describe("ErrorBoundary", () => {
    let consoleErrorSpy: jest.SpyInstance;
    let errorMock: Error;

    beforeAll(() => {
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {
        });
        errorMock = new Error("This is a test error!");
    });

    afterAll(() => {
        consoleErrorSpy.mockRestore();
    });

    describe("when there is no error", () => {
        it("<ErrorBoundary /> should render children components", () => {
            const tree = render(
                <ErrorBoundary>
                    <Text>'Child Component'</Text>
                </ErrorBoundary>
            ).toJSON();
            expect(tree);
        });
    })

})
