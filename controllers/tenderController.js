class TenderController {
  constructor({ tenderService, userService, tenderMapper }) {
    this.tenderService = tenderService;
    this.userService = userService;
    this.tenderMapper = tenderMapper;
  }

  async listTenders(req, res) {
    const tenders = await this.tenderService.getAllTenders();
    let user = null;
    if (req.session.user) {
      user = await this.userService.getUserById(req.session.user.id);
    }
    const message = req.session.message;
    req.session.message = null;
    res.render('tenders', { tenders, user, message });
  }

  async viewTender(req, res) {
    const id = parseInt(req.params.id);
    const tender = await this.tenderService.getTenderById(id);
    if (!tender) return res.status(404).send('tender-not-found');
    let user = null;
    if (req.session.user) {
      user = await this.userService.getUserById(req.session.user.id);
    }
    res.render('tender', { tender, user });
  }

  showCreateForm(req, res) {
    if (!req.session.user) return res.redirect('/login');
    res.render('createTender');
  }

  async createTender(req, res) {
    if (!req.session.user) return res.redirect('/login');

    const { title, startingPrice, description } = req.body;
    const userId = req.session.user.id;

    if (!title || !startingPrice) {
      req.session.message = 'Invalid input';
      return res.redirect('/create');
    }

    if (isNaN(parseFloat(startingPrice)) || parseFloat(startingPrice) <= 0) {
      req.session.message = 'Invalid starting price';
      return res.redirect('/create');
    }

    try {
      await this.tenderService.createTender({ title, startingPrice, description, userId });
      res.redirect('/');
    } catch (err) {
      req.session.message = `Error: ${err.message}`;
      res.redirect('/');
    }
  }

  async deleteTender(req, res) {
    const tenderId = parseInt(req.params.id);
    const tender = await this.tenderService.getTenderById(tenderId);

    if (!tender) return res.status(404).send('Tender not found');
    if (!req.session.user || req.session.user.id !== tender.userId)
      return res.status(403).send('Not authorized to delete this tender');

    try {
      await this.tenderService.deleteTender(tenderId, req.session.user.id);
      req.session.message = 'Tender deleted successfully';
    } catch (err) {
      req.session.message = `Error: ${err.message}`;
    }

    res.redirect('/');
  }

  async closeTender(req, res) {
    const tenderId = parseInt(req.params.id);
    const userId = req.session.user.id;

    try {
      await this.tenderService.closeTender(tenderId, userId);
      req.session.message = 'Tender closed';
    } catch (err) {
      req.session.message = `Error: ${err.message}`;
    }

    res.redirect(`/tenders/${tenderId}`);
  }
}

module.exports = TenderController;
