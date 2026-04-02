import { View, Text, StyleSheet } from 'react-native'
import {useState} from 'react'
import { useThemeColorWithName } from '@/hooks/useThemeColor';
import { ThemedText } from '../ThemedText';
import { Budget } from '@/types/expanse';

export default function BudgetCard({budget}:{budget:Budget}) {

  const {budget_amount,month,total_expense,year} = budget
  // Colors
  const backgroundColor = useThemeColorWithName("background");
  const blurBackgroundColor = useThemeColorWithName("blurBg");

   return (
    <View
      style={{
        backgroundColor,
         marginVertical: 5, 
        width:"100%"
      }}
    >
      <View
        style={[
          styles.rowStyle,
          {
            backgroundColor: blurBackgroundColor,
          },
        ]}
      >
        {/* Center Date */}
            <ThemedText style={styles.expanseDate} colorName='tabIconDefault'>
              {year} &mdash; {new Date(2020, parseInt(month, 10) - 1, 1).toLocaleString('en-US', { month: 'long' })}
       
            </ThemedText>
        <View style={styles.details}>
            {/* Budget */}
         
         <View style={[styles.description]}>
            <ThemedText  type='smallText' style={{ fontSize: 12}}>
                Budget
            </ThemedText>
            <ThemedText style={{fontSize:24, lineHeight:28, fontWeight:700}}>
                {budget_amount}
            </ThemedText >
          </View>
          {/* Expense  */}
          <View style={[styles.description]}>
                <ThemedText style={{textAlign:"right", fontSize: 12}} type='smallText'>
                Expese
            </ThemedText>
            <ThemedText colorName='antiFlashWhite'  style={{textAlign:"right", fontSize:24, lineHeight:28, fontWeight:700}}>
                {total_expense}
            </ThemedText>
          </View>
        </View>
     
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  rowStyle: {
    position: "relative",
    zIndex: 3,
    backfaceVisibility: "hidden",
     width:"100%",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
  details: {
     width:"100%",
     paddingHorizontal:"1%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  
  },
  expanseDate: {
    fontSize: 15,
    letterSpacing:1.5,
    textDecorationLine:"underline",
    textDecorationStyle:"dashed",
    lineHeight: 12,
    paddingVertical:4,

  },
  description: {
    // paddingVertical: 5,
  }
});
