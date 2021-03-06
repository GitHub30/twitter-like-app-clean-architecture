import * as entities from '@pirosikick/entities';
import * as usecases from '@pirosikick/usecases';
import uuid from 'uuid/v4';

interface IUserPasswordCredential {
  userId: string;
  password: string;
}

export default class MemoryDataAccess
  implements
    // ユースケースのDetaAccessを実装
    usecases.signUpWithPassword.IDataAccess,
    usecases.signInWithPassword.IDataAccess,
    usecases.createTweet.IDataAccess,
    usecases.createRetweet.IDataAccess,
    usecases.getTweets.IDataAccess,
    usecases.createUser.IDataAccess {
  // メモリ上（変数）にデータを保存
  private users: entities.IUser[] = [];
  private userPasswordCredentials: IUserPasswordCredential[] = [];
  private tweets: entities.ITweet[] = [];
  private retweets: entities.IRetweet[] = [];

  public createUser(name: string): Promise<entities.IUser> {
    const user = {
      id: uuid(),
      name,
      createdAt: new Date()
    };

    this.users.push(user);
    return Promise.resolve(user);
  }

  public findUserById(id: string): Promise<entities.IUser | null> {
    const user = this.users.find(u => u.id === id);
    return Promise.resolve(user || null);
  }

  public findUserByName(name: string): Promise<entities.IUser | null> {
    const user = this.users.find(u => u.name === name);
    return Promise.resolve(user || null);
  }

  public createTweet(userId: string, text: string): Promise<entities.ITweet> {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new Error(`user whose id is "${userId}" not exists`);
    }

    const tweet = {
      id: uuid(),
      userId: user.id,
      text,
      createdAt: new Date()
    };
    this.tweets.push(tweet);
    return Promise.resolve(tweet);
  }

  public createRetweet(
    userId: string,
    tweetId: string
  ): Promise<entities.IRetweet> {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new Error(`user whose id is "${userId}" not exists`);
    }

    const tweet = this.findTweetById(tweetId);
    if (!tweet) {
      throw new Error(`tweet whose id is "${tweetId}" not exists`);
    }

    const id = uuid();
    const createdAt = new Date();
    const retweet = {
      id: uuid(),
      userId: user.id,
      tweetId: tweet.id,
      createdAt: new Date()
    };
    this.retweets.push(retweet);
    return Promise.resolve(retweet);
  }

  public findTweetsByUserName(userName: string): Promise<entities.ITweet[]> {
    const user = this.users.find(u => u.name === userName);
    if (!user) {
      throw new Error(`use whose name is "${userName}" not exists`);
    }

    const tweets = this.tweets.filter(tweet => tweet.userId === user.id);

    return Promise.resolve(tweets);
  }

  public createUserWithPassword(
    userName: string,
    password: string
  ): Promise<entities.IUser> {
    const user = {
      id: uuid(),
      name: userName,
      createdAt: new Date()
    };
    const userPasswordCredential = {
      userId: user.id,
      password
    };

    this.users.push(user);
    this.userPasswordCredentials.push(userPasswordCredential);

    return Promise.resolve(user);
  }

  public verifyPassword(
    userName: string,
    password: string
  ): Promise<entities.IUser | null> {
    const user = this.users.find(u => u.name === userName);
    if (!user) {
      return Promise.resolve(null);
    }

    const credential = this.userPasswordCredentials.find(
      c => c.userId === user.id
    );
    if (!credential) {
      throw new Error(`the credential whose userId = '${user.id}' not exists`);
    }

    return Promise.resolve(credential.password === password ? user : null);
  }

  private findTweetById(id: string): entities.ITweet | null {
    const tweet = this.tweets.find(t => t.id === id);
    return tweet || null;
  }
}
