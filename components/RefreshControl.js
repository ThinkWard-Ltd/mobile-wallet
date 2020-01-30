import React from 'react';
import {
  ScrollView,
  RefreshControl,
} from 'react-native';

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

  
export default ({ children, swipeRefresh }) => {
    /*
    const [refreshing, setRefreshing] = React.useState(false);
    
    const onRefresh = React.useCallback(() => {
        swipeRefresh(true);
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, [refreshing]);
   */
   refreshing =false
   const onRefresh = (err, data)=> {
    
   }
  return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
        }
      >
      {children}
      </ScrollView>
  );
};
