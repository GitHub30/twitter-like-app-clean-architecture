import DataAccess from './DataAccess';
import DataAccessError from './DataAccessError';

interface InteractorInput {
  userId: string;
  tweetId: string;
}

interface InteractorOutput {
  retweet: {
    id: string;
    user: {
      id: string;
      name: string;
      createdAt: Date;
    };
    tweet: {
      id: string;
      user: {
        id: string;
        name: string;
        createdAt: Date;
      };
      text: string;
      createdAt: Date;
    };
    createdAt: Date;
  };
}

export default class RetweetUseCase {
  private dataAccess: DataAccess;

  constructor(dataAccess: DataAccess) {
    this.dataAccess = dataAccess;
  }

  public async retweet(input: InteractorInput): Promise<InteractorOutput> {
    try {
      const retweet = await this.dataAccess.createRetweet(
        input.userId,
        input.tweetId
      );
      return { retweet };
    } catch (cause) {
      throw new DataAccessError(cause, 'failed to create retweet');
    }
  }
}
