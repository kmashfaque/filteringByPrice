import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  makeStyles,
  Paper,
  Radio,
  RadioGroup,
  Slider,
  TextField,
  Typography,
} from "@material-ui/core";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import BootcampCard from "../components/BootcampCard";

const useStyles = makeStyles({
  root: {
    marginTop: 20,
  },
  loader: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  paper: {
    marginBottom: "1rem",
    padding: "13px",
  },
  filters: {
    padding: "0 1.5rem",
  },
  priceRangeInputs: {
    display: "flex",
    justifyContent: "space-between",
  },
});

const BootcampsPage = () => {
  // material ui styles
  const classes = useStyles();

  const navigate = useNavigate();
  const location = useLocation();
  const params = location.search ? location.search : null;

  // component state
  const [bootcamps, setBootcamps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sliderMax, setSliderMax] = useState(1000);
  const [priceRange, setPriceRange] = useState([25, 300]);
  const [filter, setFilter] = useState("");
  const [priceOrder, setPriceOrder] = useState("descending");
  const [sorting, setSorting] = useState("");

  const updateUIValues = (uiValues) => {
    setSliderMax(uiValues.maxPrice);

    if (uiValues.filtering.price) {
      let priceFilter = uiValues.filtering.price;

      setPriceRange([Number(priceFilter.gte), Number(priceFilter.lte)]);
    }

    if (uiValues.sorting.price) {
      let priceSort = uiValues.sorting.price;
      setPriceOrder(priceSort);
    }
  };

  // side effects
  useEffect(() => {
    let cancel;
    const fetchData = async () => {
      setLoading(true);

      try {
        let query;

        if (params && !filter) {
          query = params;
        } else {
          query = filter;
        }

        if (sorting) {
          if (query.length === 0) {
            query = `?sort=${sorting}`;
          } else {
            query = query + "&sort=" + sorting;
          }
        }

        const { data } = await axios({
          method: "GET",
          url: `/api/v1/bootcamps${query}`,
          cancelToken: new axios.CancelToken((c) => (cancel = c)),
        });

        setBootcamps(data.data);
        setLoading(false);
        updateUIValues(data.uiValues);
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.log(error.response.data);
      }
    };

    fetchData();

    return () => cancel();
  }, [filter, params, sorting]);

  const onSliderCommitHandler = (e, newVal) => {
    buildRangeFilter(newVal);
  };

  const handlePriceInputChange = (e, type) => {
    let newRange;
    if (type === "lower") {
      newRange = [...priceRange];
      newRange[0] = Number(e.target.value);
      setPriceRange(newRange);
    }

    if (type === "upper") {
      newRange = [...priceRange];
      newRange[1] = Number(e.target.value);
      setPriceRange(newRange);
    }
  };
  const onTextFieldCommitHandler = () => {
    buildRangeFilter(priceRange);
  };

  const buildRangeFilter = (newVal) => {
    const urlFilter = `?price[gte]=${newVal[0]}&price[lte]=${newVal[1]}`;

    setFilter(urlFilter);
    navigate(urlFilter);
  };

  const handleSortChange = (e) => {
    setPriceOrder(e.target.value);

    if (e.target.value === "ascending") {
      setSorting("price");
    } else if (e.target.value === "descending") {
      setSorting("-price");
    }
  };

  return (
    <Container className={classes.root}>
      {/* filtering and sorting section */}
      <Paper className={classes.paper}>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>Filters</Typography>

            <div className={classes.filters}>
              <Slider
                min={0}
                max={sliderMax}
                value={priceRange}
                disabled={loading}
                valueLabelDisplay="auto"
                onChange={(e, newVal) => setPriceRange(newVal)}
                onChangeCommitted={onSliderCommitHandler}
              />

              <div className={classes.priceRangeInputs}>
                <TextField
                  size="small"
                  id="lower"
                  label="Min Price"
                  variant="outlined"
                  type="number"
                  disabled={loading}
                  value={priceRange[0]}
                  onChange={(e) => handlePriceInputChange(e, "lower")}
                  onBlur={onTextFieldCommitHandler}
                />
                <TextField
                  size="small"
                  id="upper"
                  label="Max Price"
                  variant="outlined"
                  type="number"
                  disabled={loading}
                  value={priceRange[1]}
                  onChange={(e) => handlePriceInputChange(e, "upper")}
                  onBlur={onTextFieldCommitHandler}
                />
              </div>
            </div>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>Sort By</Typography>

            <FormControl component="fieldset" className={classes.filters}>
              <RadioGroup
                aria-label="price-order"
                name="price-order"
                value={priceOrder}
                onChange={handleSortChange}
              >
                <FormControlLabel
                  value="descending"
                  disabled={loading}
                  control={<Radio />}
                  label="Price: Highest - Lowest"
                />
                <FormControlLabel
                  value="ascending"
                  disabled={loading}
                  control={<Radio />}
                  label="Price: Lowest - Highest"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* bootcamp listing */}
      <Grid container spacing={2}>
        {loading ? (
          <div className={classes.loader}>
            <CircularProgress size="3rem" thickness={5} />
          </div>
        ) : (
          bootcamps.map((bootcamp) => (
            <Grid item key={bootcamp._id} xs={12} sm={6} md={4} lg={3}>
              <BootcampCard bootcamp={bootcamp} />
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default BootcampsPage;
