import React, { PureComponent } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { JSText, JSButton } from '../generic/index';

interface State {
  chosentags: Array<string>,
  Food: Array<string>,
  Drink: Array<string>,
  Tufts: Array<string>,
  Relationships: Array<string>,
  Hobbies: Array<string>,
  Music: Array<string>,
  Sports: Array<string>,
  Misc: Array<string>,
  xxx: Array<string>,
  tagTitles: Array<string>,
}

type Props = NavigationScreenProps<{}>

class TagsScreen extends PureComponent<Props, State> {

  constructor(props: Props) {
     super(props);
     this.state = {
       chosentags: ["did porn to pay tuition", "idc stuff my face", "chinese"],
       Food: ["chinese", "korean", "🍕", "🍣", "🍔", "brunch", "breakfast", "froyo",
                "thai", "spicy", "vegan", "vegetarian", "carnivore", "idc stuff my face"],
       Drink: ["🍺","natty light", "IPAs", "rum", "vodka", "tequila", "whisky", "wine", "brandy", "gin", "baijiu", "sake", "soju", "scotch", "fireball", "cocktails", "ethanol", "rubinoff"],
       Tufts: ["club president", "acapella", "meme royalty", "dewick", "carm", "hodgdon", "mugar", "MCATs", "musical theatre", "double major", "jobless af",
              "dual-degree", "quirky queen", "halligan lyfe", "greek", "tisch lyfe",  "5 year program", "journalism", "liberal arts", "engineering", "Fletcher wannabe", "did porn to pay tuition"],
       Relationships: ["🏳️‍🌈", "👫", "👬", "👭", "taken af", "single af", "open relationship", "poly", "complicated", "married", "single", "it’s cuffing szn", "one night stands", "'I do CS'", "can't afford a relationship", "here for the memes"],
       Hobbies: ["420", "swimming", "hiking", "netflix", "traveling", "clubbing", "singing", "powerlifting", "running", "dancing", "fire-juggling", "I don’t go outside"],
       Music: ["Pop", "rap", "EDM", "hip hop", "folk", "dubstep", "soul", "indie", "metal", "rock", "alternative", "classical", "blues", "jazz", "punk", "country", "I collect vinyls"],
       Sports: ["go pats", "fuck the pats"],
       Misc: ["team star wars", "team star trek", "team LOTR", "NY-bound", "SF-bound", "BOS-bound", "DC-bound", "leaving the US", "2cool4school", "the future scares me", "add me on LinkedIn"],
       xxx: ["bdsm (light)", "bdsm (heavy)", "devil’s 3some", "angel’s 3some", "3some", "thirsty af", "butt stuff", "swinging", "spanking", "role play", "call me daddy"],
      tagTitles: ["Food", "Drink", "Tufts", "Relationships", "Hobbies", "Music", "Sports", "Misc", "xxx"],
     };
   }

  render() {
    return (
      <ScrollView>
      <View style={styles.bio}>
        <JSText style={styles.title}><JSText style={{textDecorationLine: 'underline',color: '#171767', fontWeight: 'bold'}}>Tap </JSText>the tags that apply to you!</JSText>
        <JSText style={styles.subtitle}>Please note, tags are public to everyone</JSText>
      </View>
      <View
        style={{
          borderBottomColor: 'grey',
          borderBottomWidth: 1,
        }}
      />
      <View style={styles.bio}>
        {this.state.tagTitles.map((tag) =>
          (<View style={styles.bioItem} key={tag}>
            <JSText>{tag} </JSText>
            <View style={styles.reactRow}>
            {this.rendersubTags(tag)}
            </View>
            </View>))}

        </View>
        <View style={styles.buttons}>
          <JSButton onPress={() => this.props.navigation.goBack()} label="Save Changes"></JSButton>
        </View>
      </ScrollView>
    )
  }

  private rendersubTags(tag: string){
    switch(tag) {
      case "Food":
          return (this.state.Food.map((tag) => (<Text style={this.state.chosentags.includes(tag)? styles.highlightedTags :styles.tags} key={tag} onPress={() => this.toggleTag(tag)}> {tag} </Text>)))
      case "Drink":
          return (this.state.Drink.map((tag) => (<Text style={this.state.chosentags.includes(tag)? styles.highlightedTags :styles.tags} key={tag} onPress={() => this.toggleTag(tag)}> {tag} </Text>)))
      case "Tufts":
          return (this.state.Tufts.map((tag) => (<Text style={this.state.chosentags.includes(tag)? styles.highlightedTags :styles.tags} key={tag} onPress={() => this.toggleTag(tag)}> {tag} </Text>)))
      case "Relationships":
          return (this.state.Relationships.map((tag) => (<Text style={this.state.chosentags.includes(tag)? styles.highlightedTags :styles.tags} key={tag} onPress={() => this.toggleTag(tag)}> {tag} </Text>)))
      case "Hobbies":
          return (this.state.Hobbies.map((tag) => (<Text style={this.state.chosentags.includes(tag)? styles.highlightedTags :styles.tags} key={tag} onPress={() => this.toggleTag(tag)}> {tag} </Text>)))
      case "Music":
          return (this.state.Music.map((tag) => (<Text style={this.state.chosentags.includes(tag)? styles.highlightedTags :styles.tags} key={tag} onPress={() => this.toggleTag(tag)}> {tag} </Text>)))
      case "Sports":
          return (this.state.Sports.map((tag) => (<Text style={this.state.chosentags.includes(tag)? styles.highlightedTags :styles.tags} key={tag} onPress={() => this.toggleTag(tag)}> {tag} </Text>)))
      case "Misc":
          return (this.state.Misc.map((tag) => (<Text style={this.state.chosentags.includes(tag)? styles.highlightedTags :styles.tags} key={tag} onPress={() => this.toggleTag(tag)}> {tag} </Text>)))
      case "xxx":
          return (this.state.xxx.map((tag) => (<Text style={this.state.chosentags.includes(tag)? styles.highlightedTags :styles.tags} key={tag} onPress={() => this.toggleTag(tag)}> {tag} </Text>)))
  }
    return <Text></Text>
}

private toggleTag(tag: string){
  if (this.state.chosentags.includes(tag)){
    let array = this.state.chosentags
    let index = array.indexOf(tag)
    array.splice(index, 1)
    this.setState({chosentags: array})
    this.forceUpdate()
  } else {
    this.setState({chosentags: this.state.chosentags.concat([tag])})
  }
}

}

export default TagsScreen


const styles = StyleSheet.create({
  buttons:{
    flex: 1,
    justifyContent: 'space-around',
    paddingVertical: 1,
  },
  bioItem:{
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  bio: {
    flex: 8,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  tags:{
    fontSize: 16,
    color: 'grey',
    alignSelf: 'flex-start'
  },
  highlightedTags:{
    fontSize: 16,
    textDecorationLine: 'underline',
    color: '#171767',
  },
  reactRow:{
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    paddingVertical: 10,
    alignItems: 'flex-start',
    alignSelf: 'flex-start'
  },
  title: {
    fontSize: 40,
    alignSelf: 'center'
  },
  subtitle:{
    fontSize: 12,
    fontWeight: 'bold', alignSelf: 'center'
  }
})
