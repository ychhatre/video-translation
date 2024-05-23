import axios from "axios";

export default class Client {
  url: string;
  constructor(url: string) {
    this.url = url;
  }

  async getStatus(): Promise<string> {
    try {
      const res = await axios.get(`${this.url}/status`);
      return res.data.status;
    } catch (error) {
      console.error(`${error}`);
      return "error";
    }
  }

  async callAgain(initialDelay: number, maxDelay: number) {
    let delay = initialDelay;
    while (true) {
      const status: string = await this.getStatus();
      if (status == "accepted") {
        return status;
      } else {
        await this.sleep(delay);
        delay = Math.min(delay * 1.5, maxDelay);
      }
    }
  }

  async sleep(delay: number) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
}
