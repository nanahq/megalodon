global.__reanimatedWorkletInit = jest.fn();

jest.mock("expo-linking", () => {
    return {
        ...jest.requireActual("expo-linking"),
        createURL: jest.fn(),
    };
});
