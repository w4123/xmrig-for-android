import React from 'react';
import { WebView } from 'react-native-webview';
import { Keyboard, View, ViewStyle } from 'react-native';

const EDITOR_INDEX_PATH = 'file:///android_asset/editor/index.html';

export type EditorProps = {
  code?: string;
  language?: string;
  onCodeChange: (data: string) => void;
  theme?: string;
  onKeyboardChange?: (isVisible: boolean) => void;
  style: ViewStyle;
};

function Editor(
  {
    code = '',
    language = 'json',
    onCodeChange,
    theme = 'dark',
    onKeyboardChange,
    style,
  }: EditorProps,
  ref: any,
) {
  const editorRef = React.useRef<WebView>(null);
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => setKeyboardVisible(true), 250);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setTimeout(() => setKeyboardVisible(false), 250);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  React.useImperativeHandle(ref, () => ({
    simulateKeyPress: (key: any) => {
      if (editorRef !== null) {
        editorRef?.current?.injectJavaScript(`
          window.simulateKeyPress("${key}");
          true;
        `);
      }
    },
    scrollToPosition: () => {
      if (editorRef !== null) {
        editorRef?.current?.injectJavaScript(`
          window.scrollToPosition();
          true;
        `);
      }
    },
  }));

  React.useEffect(() => {
    if (isLoaded && editorRef !== null) {
      editorRef?.current?.injectJavaScript(`
        window.replaceCode(\`${code}\`)
        true;
      `);
    }
  }, [code, isLoaded]);

  React.useEffect(() => {
    if (isLoaded && editorRef !== null) {
      editorRef?.current?.injectJavaScript(`
        window.replaceLanguage(\`${language}\`)
        true;
      `);
    }
  }, [language, isLoaded]);

  React.useEffect(() => {
    if (isLoaded && editorRef !== null) {
      editorRef?.current?.injectJavaScript(`
        window.replaceTheme(\`${theme}\`);
        true;
    `);
    }
  }, [theme, isLoaded]);

  const onEditorMesssage = (e: { nativeEvent: { data: string; }; }) => {
    const { event, data } = JSON.parse(e.nativeEvent.data);
    console.log(event, data);
    if (event === 'code-change' && onCodeChange) {
      onCodeChange(data);
    }
  };

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow', // should be keyboardDidShow on android, will show is not supported
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide', // should be keyboardDidHide on android, will show is not supported
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  React.useEffect(() => {
    if (onKeyboardChange) {
      onKeyboardChange(isKeyboardVisible);
    }
  }, [isKeyboardVisible]);

  return React.useMemo(() => (
    <View style={[style, { width: '100%' }]}>
      <WebView
        style={{ margin: 0, padding: 0 }}
        originWhitelist={['*', 'file://']}
        ref={editorRef}
        source={{ uri: EDITOR_INDEX_PATH }}
        scrollEnabled={false}
        onLoadEnd={() => {
          setIsLoaded(true);
        }}
        onMessage={onEditorMesssage}
      />
    </View>
  ), [isLoaded, isKeyboardVisible]);
}

export default React.forwardRef(Editor);
