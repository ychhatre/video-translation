import axios from "axios";
import { v4 as uuidv4 } from "uuid";
export default class Client {
  initialDelay: number;
  maxDelay: number;
  maxRetries: number;
  expBackoffConstant: number;
  url: string;
  currentRetries: number = 0;
  jobID: any;

  disconnect: boolean = false;
  constructor(url: string, options: any = {}) {
    this.url = url;
    this.expBackoffConstant = options.exp_constant;
    this.maxRetries = options.maxRetries;
    this.initialDelay = options.initialDelay;
    this.maxDelay = options.maxDelay;
    this.jobID = options.jobID ? options.jobID : uuidv4();
  }

  private async getStatus(needsCaching: boolean): Promise<string> {
    try {
      const res = await axios({
        method: "get",
        url: `${this.url}/status`,
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          constant: this.expBackoffConstant,
          jobID: this.jobID,
          caching: needsCaching,
        },
      });
      return res.data.status;
    } catch (error) {
      return "error";
    }
  }

  public async completeRequest() {
    let delay = this.initialDelay;
    while (this.currentRetries < this.maxRetries && !this.disconnect) {
      let status: string;
      if (this.currentRetries === 0) {
        status = await this.getStatus(true);
      } else {
        status = await this.getStatus(false);
      }

      if (status == "accepted") {
        console.log(`Status is: ${status}.`);
        return status;
      } else {
        await this.sleep(delay);
        this.currentRetries++;
        console.log(
          `Status is: ${status}. Retrying in ${delay} seconds... Attempt ${this.currentRetries} / ${this.maxRetries}`
        );
        delay = Math.min(delay * this.expBackoffConstant, this.maxDelay);
      }
    }
    if (!this.disconnect) {
      console.log(
        `Max number of retries reached (${this.maxRetries})... Exiting with error status`
      );
    } else {
      console.log(
        `Disconnected from the server... your job is still running in the background. Here is the your jobID: ${this.jobID}`
      );
    }

    return "error";
  }

  public disconnectClient() {
    this.disconnect = true;
  }
  // simulate
  private async sleep(delay: number) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
}
