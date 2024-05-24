import axios from "axios";

export default class Client {
  expBackoffConstant: number;
  url: string;
  constructor(url: string, constant: number) {
    this.url = url;
    this.expBackoffConstant = constant; 
  }

  private async getStatus(): Promise<string> {
    try {
      const res = await axios({
        method: "get",
        url: `${this.url}/status/${this.expBackoffConstant}`,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res.data);
      return res.data.status;
    } catch (error) {
      console.log({ status: "error" });
      return "error";
    }
  }

  public async complete(initialDelay: number, maxDelay: number) {
    let delay = initialDelay;
    while (true) {
      const status: string = await this.getStatus();
      if (status == "accepted") {
        return status;
      } else {
        await this.sleep(delay);
        console.log(delay)
        delay = Math.min(delay * 1.5, maxDelay);
      }
    }
  }

  // simulate
  private async sleep(delay: number) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
}
