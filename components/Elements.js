import { SafeAreaView, StatusBar } from "react-native";

export const SafeWrapper = ({ children }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
            <StatusBar barStyle='light-content' backgroundColor='black' />
            {children}
        </SafeAreaView>
    )
}